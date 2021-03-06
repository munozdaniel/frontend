import { Component, Input, OnInit } from '@angular/core';
import { IPlanillaTaller } from 'app/models/interface/iPlanillaTaller';

@Component({
  selector: 'app-planilla-detalle-general',
  templateUrl: './planilla-detalle-general.component.html',
  styleUrls: ['./planilla-detalle-general.component.scss'],
})
export class PlanillaDetalleGeneralComponent implements OnInit {
  @Input() planillaTaller: IPlanillaTaller;
  constructor() {}

  ngOnInit(): void {}
}
