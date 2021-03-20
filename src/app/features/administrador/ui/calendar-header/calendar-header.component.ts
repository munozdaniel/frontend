import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-header',
  template: `
    <div class="row text-center">
      <div class="col-md-4">
        <div class="btn-group">
          <button
            color="accent"
            mat-raised-button
            mwlCalendarPreviousView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
            Anterior
          </button>
          <button mat-raised-button mwlCalendarToday [(viewDate)]="viewDate" (viewDateChange)="viewDateChange.next(viewDate)">Hoy</button>
          <button
            mat-raised-button
            color="accent"
            mwlCalendarNextView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
            Siguiente
          </button>
        </div>
      </div>
      <div class="col-md-4">
        <h3>{{ viewDate | date: 'dd  MMMM yyyy':'GMT' }}</h3>
      </div>
    </div>
    <br />
  `,
  styles: [],
})
export class CalendarHeaderComponent implements OnInit {
  @Input() view: CalendarView;

  @Input() viewDate: Date;

  @Input() locale: string = 'en';

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;
  constructor() {}

  ngOnInit(): void {}
}
