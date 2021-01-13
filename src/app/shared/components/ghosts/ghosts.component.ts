import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ghosts',
  templateUrl: './ghosts.component.html',
  styleUrls: ['./ghosts.component.scss'],
})
export class GhostsComponent implements OnInit {
  @Input() tipo: 'input' | 'checkbox' | 'custom' | 'textarea' | 'p' | 'h1' | 'static';
  @Input() class?: string;
  constructor() {}

  ngOnInit() {}
}
