import { trigger, state, style, transition, animate } from '@angular/animations';
import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { ITema } from 'app/models/interface/iTema';

@Component({
  selector: 'app-planilla-detalle-temas',
  templateUrl: './planilla-detalle-temas.component.html',
  styleUrls: ['./planilla-detalle-temas.component.scss'],
  animations: [
    designAnimations,
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PlanillaDetalleTemasComponent implements OnInit, OnChanges {
  @Input() temas: ITema[];
  @Input() cargandoTemas: boolean;

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['fecha', 'nroClase', 'unidad', 'caracterClase', 'temaDelDia', 'temasProximaClase'];
  // Mobile
  expandedElement: ITema | null;
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver
  ) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
        this.columnas = ['fecha', 'temaDelDia'];
      } else {
        this.isMobile = false;

        this.columnas = ['fecha', 'nroClase', 'unidad', 'caracterClase', 'temaDelDia', 'temasProximaClase'];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.temas && changes.temas.currentValue) {
      this.dataSource.data = this.temas;
    }
  }

  ngOnInit(): void {}
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
