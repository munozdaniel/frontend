import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-planilla-stepper',
  templateUrl: './planilla-stepper.component.html',
  styleUrls: ['./planilla-stepper.component.scss'],
})
export class PlanillaStepperComponent implements OnInit {
  @Input() cargando = false;
  constructor() {}

  ngOnInit(): void {}
}
