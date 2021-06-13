import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { designAnimations } from '@design/animations';
import { IProfesor } from 'app/models/interface/iProfesor';
import { IUsuario } from 'app/models/interface/iUsuario';
import { NgxPermissionsService } from 'ngx-permissions';
import { AsignarProfesorComponent } from '../../containers/asignar-profesor/asignar-profesor.component';

@Component({
  selector: 'app-usuarios-tabla',
  templateUrl: './usuarios-tabla.component.html',
  styleUrls: ['./usuarios-tabla.component.scss'],
  animations: [designAnimations],
})
export class UsuariosTablaComponent implements OnInit, OnChanges {
  @Input() cargandoProfesores: boolean;
  @Input() profesores: IProfesor[];
  @Input() usuarios: IUsuario[];
  @Input() cargando: boolean;
  @Output() retCambiarRol = new EventEmitter<IUsuario>();
  @Output() retActualizarTabla = new EventEmitter<boolean>();
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['email', 'nombre', 'profesor', 'rol', 'observacion', 'fechaCreacion', 'opciones'];
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(
    //
    private _permissionsService: NgxPermissionsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public breakpointObserver: BreakpointObserver,
    private _dialog: MatDialog
  ) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
        this.columnas = ['nombreCompleto', 'rol', 'opciones'];
      } else {
        this.isMobile = false;
        this.columnas = ['email', 'nombre', 'profesor', 'rol', 'fechaCreacion', 'opciones'];
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.profesores && changes.profesores.currentValue) {
    }
    if (changes.usuarios && changes.usuarios.currentValue) {
      this.dataSource.data = this.usuarios;
    }
  }
  ngOnInit(): void {}
  filtroRapido(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  actualizarRol(usuario: IUsuario, rol: any) {
    usuario.rol = rol;
    this.retCambiarRol.emit(usuario);
  }
  asignar(usuario: IUsuario) {
    const dialogRef = this._dialog.open(AsignarProfesorComponent, {
      width: '250px',
      data: usuario,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.retActualizarTabla.emit(true);
      }
    });
  }
}
