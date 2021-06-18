import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { catchError, finalize, tap } from 'rxjs/operators';
import { PlanillaTallerService } from '../planillaTaller.service';

export class PlanillaTallerDataSource implements DataSource<IPlanillaTaller> {
  private planillaTallerSubject = new BehaviorSubject<IPlanillaTaller[]>([]);

  private cargandoSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public cargando$ = this.cargandoSubject.asObservable();
  public total$ = this.totalSubject.asObservable();

  constructor(private coursesService: PlanillaTallerService) {}

  loadPlanillaTaller(filter: string, sortField: string, sortDirection: string, pageIndex: number, pageSize: number) {
    this.cargandoSubject.next(true);

    this.coursesService
      .obtenerPlanillaTalleresPaginado(filter, sortField, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.cargandoSubject.next(false)),
        // tap((datos) => console.log('tap 2', datos)),
        tap((datos) => this.totalSubject.next(datos ? datos.totalDocs : 0))
      )
      .subscribe((planillaTaller) => this.planillaTallerSubject.next(planillaTaller ? planillaTaller.docs : []));
  }

  connect(collectionViewer: CollectionViewer): Observable<IPlanillaTaller[]> {
    console.log('Connecting data source');
    return this.planillaTallerSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.planillaTallerSubject.complete();
    this.cargandoSubject.complete();
  }
}
