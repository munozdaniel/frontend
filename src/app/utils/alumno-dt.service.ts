import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { AlumnoService } from 'app/core/services/alumno.service';
import { IAlumno } from 'app/models/interface/iAlumno';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

 
 
export class AlumnoDtService implements DataSource<IAlumno> {
    private alumnosSubject = new BehaviorSubject<IAlumno[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private _alumnoService: AlumnoService) {

    }

    loadIAlumnos(
                filter:string,
                sortDirection:string,
                pageIndex:number,
                pageSize:number) {

        this.loadingSubject.next(true);

        this._alumnoService.findAlumnos( filter, sortDirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(alumnos => this.alumnosSubject.next(alumnos));

    }

    connect(collectionViewer: CollectionViewer): Observable<IAlumno[]> {
        console.log("Connecting data source");
        return this.alumnosSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.alumnosSubject.complete();
        this.loadingSubject.complete();
    }

}
