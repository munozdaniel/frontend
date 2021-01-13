import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
    selector: "app-home",
    template: ` <p>home works!</p> `,
    styles: [],
})
export class HomeComponent implements OnInit {
    pageTitle = "Página de Inicio";

    constructor(private title: Title) {}

    ngOnInit() {
        this.title.setTitle(this.pageTitle);
    }
}
