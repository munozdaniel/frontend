import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-empty-data',
  templateUrl: './empty-data.component.html',
  // styleUrls: ['./empty-data.component.scss']
})
export class EmptyDataComponent implements OnInit {
  @Input() texto: string = 'Sin Resultados';
  constructor() {}

  ngOnInit() {}
}
