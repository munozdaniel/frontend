import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { designAnimations } from '@design/animations';

@Component({
  selector: 'app-email-unverified',
  templateUrl: './email-unverified.component.html',
  styleUrls: ['./email-unverified.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : designAnimations
})
export class EmailUnverifiedComponent implements OnInit {

  constructor( public authService: AuthService,
    @Inject(DOCUMENT) public document: Document,
    ) { }

  ngOnInit(): void {
  }

}
