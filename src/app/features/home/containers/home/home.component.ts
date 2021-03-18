import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { designAnimations } from '@design/animations';
import { AuthenticationService } from 'app/core/services/helpers/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [designAnimations],
})
export class HomeComponent implements OnInit {
  pageTitle = 'Página de Inicio';

  constructor(private title: Title, public authService: AuthenticationService) {}

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }
}
