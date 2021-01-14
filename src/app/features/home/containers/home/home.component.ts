import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AuthService } from "@auth0/auth0-angular";

@Component({
    selector: "app-home",
    template: `
        <p>home works!</p>
        <div *ngIf="authService.user$ | async as usuario">{{ usuario | json }}</div>
    `,
    styles: [],
})
export class HomeComponent implements OnInit {
    pageTitle = "Página de Inicio";

    constructor(private title: Title, public authService: AuthService) {}

    ngOnInit() {
        this.title.setTitle(this.pageTitle);
    }
}
