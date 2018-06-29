import { Component } from "@angular/core";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {
    open = true;
    toggle(e: Event) {
        e.preventDefault();
        this.open = !this.open;
    }
}
