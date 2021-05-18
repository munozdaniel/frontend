import { DOCUMENT } from '@angular/common';
import { Inject, OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { ICalendario } from 'app/models/interface/iCalendario';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendario-datos',
  templateUrl: './calendario-datos.component.html',
  styleUrls: ['./calendario-datos.component.scss'],
  // this is a hack to get styles to apply to the inner component. Your app should just use a global stylesheet
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CalendarioDatosComponent implements OnInit, OnChanges, OnDestroy {
  private readonly darkThemeClass = 'dark-theme';
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;
  view: CalendarView = CalendarView.Month;
  minDate: Date;
  maxDate: Date;
  @Input() calendario: ICalendario[];
  events: CalendarEvent[] = [];

  viewDate: Date = new Date();
  constructor(@Inject(DOCUMENT) private document, private _cookieService: CookieService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.calendario && changes.calendario.currentValue && changes.calendario.currentValue.length > 0) {
      this.minDate = this.calendario[0].fecha;
      this.maxDate = this.calendario[this.calendario.length - 1].fecha;
      this.calendario.map((x) => {
        const comisiones: any[] = this.retornarComision(x);
        const fecha = x.fecha.toString().split('T')[0]; // Esto para que no cambie la fecha al pasar a date
        comisiones.map((comision) => {
          console.log('comision.color', comision.color);
          this.events.push({
            title: comision.title,
            //   start: moment(fecha).utc().add(1, 'day').toDate(),
            start: moment(fecha).clone().toDate(),
            color: comision.color,
            allDay: true,
          });
        });
      });
      this.refresh.next();
    }
  }
  retornarComision(x: ICalendario) {
    const arreglo = [];
    if (x.comisionA) {
      arreglo.push({ title: 'COMISION A', color: 'rgb(0, 153, 255)' });
    }
    if (x.comisionB) {
      arreglo.push({ title: 'COMISION B', color: 'rgb(0, 255, 106)' });
    }
    if (x.comisionC) {
      arreglo.push({ title: 'COMISION C', color: 'rgb(187, 255, 0)' });
    }
    if (x.comisionD) {
      arreglo.push({ title: 'COMISION D', color: 'rgb(255, 208, 0)' });
    }
    if (x.comisionE) {
      arreglo.push({ title: 'COMISION E', color: 'rgb(255, 94, 0);' });
    }
    if (x.comisionF) {
      arreglo.push({ title: 'COMISION F', color: 'rgb(255, 0, 0);' });
    }
    if (x.comisionG) {
      arreglo.push({ title: 'COMISION G', color: 'rgb(255, 0, 128)' });
    }
    if (x.comisionH) {
      arreglo.push({ title: 'COMISION H', color: 'rgb(55, 0, 255)' });
    }
    return arreglo;
  }
  ngOnInit(): void {
    const cadena = this._cookieService.check('configuracion') ? this._cookieService.get('configuracion') : null;
    const configuracion = JSON.parse(cadena);

    // if (configuracion.colorTheme !== 'theme-default') {
    //   this.document.body.classList.add(this.darkThemeClass);
    // }
  }
  ngOnDestroy(): void {
    // this.document.body.classList.remove(this.darkThemeClass);
  }
  //   beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
  //     body.forEach((day) => {
  //       if (!this.dateIsValid(day.date)) {
  //         day.cssClass = 'cal-disabled';
  //       }
  //     });
  //   }
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
}
