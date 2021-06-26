import { trigger, state, style, transition, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { designAnimations } from '@design/animations';
import { RolConst } from 'app/models/constants/rol.enum';
import { TemplateEnum } from 'app/models/constants/tipo-template.const';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import { ITema } from 'app/models/interface/iTema';
import { ITemaPendiente } from 'app/models/interface/iTemaPendiente';
import { NgxPermissionsService } from 'ngx-permissions';

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
  TemplateEnum = TemplateEnum;
  clasesDictadas: number = 0;
  @Input() isUpdate?: boolean;
  @Input() planillaTaller?: IPlanillaTaller;
  @Input() template?: string;
  @Input() temas: ITema[];
  @Input() temasIncompletos: ITemaPendiente[];
  @Input() reset: number;
  temaSeleccionado: ITema = null;
  @Input() cargandoTemas: boolean;
  @Output() retAbrirModalTemas = new EventEmitter<boolean>();
  @Output() retEditarTema = new EventEmitter<ITema>();
  @Output() retEliminarTema = new EventEmitter<ITema>();
  @Output() retEliminarTemas = new EventEmitter<ITema[]>();
  @Output() retTemasCalendario = new EventEmitter<string>();
  @Output() retCargarLista = new EventEmitter<boolean>();
  @Output() retInformarIncompletos = new EventEmitter<ITema[]>();

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['seleccionar', 'fecha', 'nroClase', 'opciones'];
  // Mobile
  expandedElement: ITema | null;
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  seleccionA = new SelectionModel<ITema>(true, []);
  constructor(
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver // private _permissionsService: NgxPermissionsService
  ) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    // this._permissionsService.permissions$.subscribe((permissions) => {
    //   const permisos = Object.keys(permissions);
    //   if (permisos && permisos.length > 0) {
    //     const index = permisos.findIndex((x) => x.toString() === RolConst.JEFETALLER || x.toString() === RolConst.ADMIN);
    //     if (index !== -1) {
    //       this.columnas.unshift('seleccionar');
    //     }
    //   }
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.temasIncompletos && changes.temasIncompletos.currentValue) {
      this.temasIncompletos.forEach((t) => {
        this.dataSource.data.forEach((x) => {
          if (t.fecha === x.fecha) {
            x.incompleto = true;
            this.seleccionA.select(x);
          }
        });
      });
    }

    if (changes.reset && changes.reset.currentValue) {
      this.temaSeleccionado = null;
    }
    if (changes.temas && changes.temas.currentValue) {
      this.clasesDictadas = 0;
      this.temas.forEach((x) => {
        if (!x.motivoSinDictar && x.temaDelDia) {
          this.clasesDictadas++;
        }
      });
      this.dataSource.data = [...this.temas];
      if (this.temaSeleccionado) {
        const index = this.temas.findIndex((x) => x._id === this.temaSeleccionado._id);
        if (index !== -1) {
          this.temaSeleccionado = { ...this.temas[index] };
        }
      }
    }
  }

  ngOnInit(): void {}
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  agregarTema() {
    this.retAbrirModalTemas.emit(true);
  }
  editarTema(tema: ITema) {
    this.retEditarTema.emit(tema);
  }
  eliminarTema(tema: ITema) {
    this.retEliminarTema.emit(tema);
  }
  //   sinDictar(tema: ITema) {
  //     this.retEliminarTema.emit(tema);
  //   }
  cargarCalendario(tipo: string) {
    this.retTemasCalendario.emit(tipo);
  }
  mostrarDetalles(tema: ITema) {
    this.temaSeleccionado = { ...tema };
  }
  setActualizarLibro(event) {
    this.retCargarLista.emit(true);
  }
  informarIncompletos() {
    this.retInformarIncompletos.emit(this.seleccionA.selected);
  }
  eliminarTemas() {
    this.retEliminarTemas.emit(this.seleccionA.selected);
  }
}
