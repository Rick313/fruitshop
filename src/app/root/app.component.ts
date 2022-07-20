import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from "@angular/core";
import {map, Observable, tap} from "rxjs";
import {NotificationService, Notification} from "src/features/notification.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit {
  @ViewChild("topbar") public topbar!: ElementRef<HTMLDivElement>;
  @ViewChild("main") public main!: ElementRef<HTMLElement>;

  public readonly messages$: Observable<Notification[]>;
  public constructor(
    public readonly notification: NotificationService,
    public readonly renderer: Renderer2,
  ) {
    this.messages$ = this.notification.notifications$.pipe(
      map((notifications) =>
        notifications.length > 2
          ? notifications.splice(notifications.length - 3, notifications.length - 1)
          : notifications,
      ),
      tap((notifications) => {
        notifications.forEach((notification) => {
          const timeout = setTimeout(() => {
            if (!notification.read) notification.read = true;
            clearTimeout(timeout);
          }, 3800);
        });
      }),
    );
  }

  public ngAfterViewInit(): void {
    const {height} = this.topbar.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(
      this.main.nativeElement,
      "height",
      `calc(100% - ${height.toFixed(2)}px)`,
    );
  }
}

export default AppComponent;
