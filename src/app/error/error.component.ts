import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: "app-error",
  template: `
    <img src="/assets/astronaut.svg" alt="error" />
    <span>Nous nous sommes perdu ...</span>
  `,
})
export class ErrorComponent {
  private timeout: number | undefined;

  public constructor(
    private readonly activated: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.redirect();
  }

  public ngOnDestroy(): void {
    if (this.timeout) clearTimeout(this.timeout);
  }

  private redirect() {
    if (!(this.activated.component === ErrorComponent)) return;
    this.activated.data.subscribe(({redirect}) => {
      if (redirect !== undefined) {
        this.timeout = setTimeout(() => {
          this.router.navigate([redirect]);
          clearTimeout(this.timeout);
        }, 3500) as unknown as number;
      }
    });
  }
}

export default ErrorComponent;
