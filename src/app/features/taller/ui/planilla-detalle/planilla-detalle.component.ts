import { Component, Input, OnInit } from '@angular/core';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';

@Component({
  selector: 'app-planilla-detalle',
  templateUrl: './planilla-detalle.component.html',
  styleUrls: ['./planilla-detalle.component.scss'],
})
export class PlanillaDetalleComponent implements OnInit {
  @Input() planillaTaller: IPlanillaTaller;
  constructor() {}

  ngOnInit(): void {}
}
