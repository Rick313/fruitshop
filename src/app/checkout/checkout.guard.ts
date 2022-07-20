import {Injectable} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

import BackPackService from "src/features/backpack.service";

@Injectable()
export class CheckoutGuard implements CanActivate {
  public constructor(
    private readonly router: Router,
    private readonly backpack: BackPackService,
  ) {}
  public canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    if (this.backpack.articles.length < 1) return this.router.navigate(["/"]);
    return true;
  }
}

export default CheckoutGuard;
