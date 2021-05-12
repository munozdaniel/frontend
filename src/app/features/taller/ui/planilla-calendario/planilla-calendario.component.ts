import { MediaMatcher, BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { ICalendario } from 'app/models/interface/iCalendario';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';
import * as moment from 'moment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-planilla-calendario',
  templateUrl: './planilla-calendario.component.html',
  styleUrls: ['./planilla-calendario.component.scss'],
})
export class PlanillaCalendarioComponent implements OnInit, OnChanges {
  @Input() cargando: boolean;
  @Input() planillaTaller: IPlanillaTaller;
  @Input() calendario: ICalendario[];
  opcionSeleccionada: string;
  toppings = new FormControl();
  toppingList: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  view: CalendarView = CalendarView.Month;
  minDate: Date;
  maxDate: Date;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
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
      } else {
        this.isMobile = false;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.calendario && changes.calendario.currentValue) {
      console.log(' changes.calendario.currentValue', changes.calendario.currentValue);
      this.setCalendario();
    }
    if (changes.planillaTaller && changes.planillaTaller.currentValue) {
      this.minDate = moment.utc(this.planillaTaller.fechaInicio).toDate();
      this.maxDate = moment.utc(this.planillaTaller.fechaFinalizacion).toDate();
    }
  }

  ngOnInit(): void {}
  setCalendario() {
    this.events = this.calendario.map((x) => {
      const fecha = x.fecha.toString().split('T')[0]; // Esto para que no cambie la fecha al pasar a date
      return {
        title: x.titulo,
        //   start: moment(fecha).utc().add(1, 'day').toDate(),
        start: moment(fecha).clone().toDate(),
        color: { primary: x.color, secondary: 'red' },
        allDay: true,
      };
    });
    this.refresh.next();
  }
  
  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (
      moment(date).isSame(moment(this.viewDate), 'month')
      // isSameMonth(date, this.viewDate)
    ) {
      if (
        //   (isSameDay(this.viewDate, date)
        (moment(date).isSame(moment(this.viewDate), 'day') && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  actualizarCalendario() {}
}
