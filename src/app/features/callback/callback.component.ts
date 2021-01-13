import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-callback",
    templateUrl: "./callback.component.html",
    styleUrls: ["./callback.component.scss"],
})
export class CallbackComponent implements OnInit {
    constructor() {
        // Check for authentication and handle if hash present
        // auth.handleAuth();
    }

    ngOnInit() {}
}
