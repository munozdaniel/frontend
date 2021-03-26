import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { designAnimations } from '@design/animations';
import { IUsuario } from 'app/models/interface/iUsuario';

@Component({
  selector: 'app-usuarios-tabla',
  templateUrl: './usuarios-tabla.component.html',
  styleUrls: ['./usuarios-tabla.component.scss'],
  animations: [designAnimations],
})
export class UsuariosTablaComponent implements OnInit, OnChanges {
  @Input() usuarios: IUsuario[];
  @Input() cargando: boolean;
  @Output() retCambiarRol = new EventEmitter<IUsuario>();
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('sort') set setSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('paginator') set setPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  columnas = ['email', 'nombre', 'apellido', 'rol', 'observacion', 'fechaCreacion', 'opciones'];
  // Mobile
  isMobile: boolean;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _media: MediaMatcher, public breakpointObserver: BreakpointObserver) {
    this.mobileQuery = this._media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this._changeDetectorRef.detectChanges();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isMobile = true;
        this.columnas = ['nombreCompleto', 'rol', 'opciones'];
      } else {
        this.isMobile = false;
        this.columnas = ['email', 'nombre', 'apellido', 'rol', 'fechaCreacion', 'opciones'];
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.usuarios && changes.usuarios.currentValue) {
      console.log('usuarios', this.usuarios);
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
}
