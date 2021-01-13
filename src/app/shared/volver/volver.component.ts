import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'button-volver',
  templateUrl: './volver.component.html',
  styleUrls: ['./volver.component.scss'],
})
export class VolverComponent implements OnInit {
  @Input() top: string = '15px';
  @Input() left: string = '25px';
  constructor(private location: Location) {}
  ngOnInit() {}
  goBack() {
    this.location.back();
  }
}
