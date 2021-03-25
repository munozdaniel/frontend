import { trigger, state, style, transition, animate } from '@angular/animations';
import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { designAnimations } from '@design/animations';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';

@Component({
  selector: 'app-planillas-modal',
  templateUrl: './planillas-modal.component.html',
  styleUrls: ['./planillas-modal.component.scss'],
  animations: [
    designAnimations,
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PlanillasModalComponent implements OnInit {
  planillas: any[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas: string[] = ['asignatura', 'profesor', 'fechaInicio', 'fechaFinalizacion', 'opciones'];
  expandedElement: any | null;
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    public dialogRef: MatDialogRef<PlanillasModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isMobile = data.isMobile;
    if (this.isMobile) {
      this.columnas = ['asignatura', 'mobile'];
    } else {
      this.columnas = ['asignatura', 'profesor', 'fechaInicio', 'fechaFinalizacion', 'opciones'];
    }
    this.planillas = data.planillas;
    this.dataSource.data = data.planillas;
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
        this.columnas = ['asignatura', 'mobile'];
      } else {
        this.isMobile = false;
        this.columnas = ['asignatura', 'profesor', 'fechaInicio', 'fechaFinalizacion', 'opciones'];
      }
    });
  }
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  cerrar(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}
  seleccionar(planilla: IPlanillaTaller) {
    this.dialogRef.close({ planilla });
  }
}
