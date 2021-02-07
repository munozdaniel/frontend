import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '@auth0/auth0-angular';
import { designAnimations } from '@design/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [designAnimations],
})
export class HomeComponent implements OnInit {
  pageTitle = 'Página de Inicio';

  constructor(private title: Title, public authService: AuthService) {}

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }
}
