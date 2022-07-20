import {CommonModule} from "@angular/common";
import {Input, NgModule, OnDestroy} from "@angular/core";
import {Router, RouterModule, Routes} from "@angular/router";
import CheckoutGuard from "./checkout/checkout.guard";
import CheckoutComponent from "./checkout/chekout.component";
import ErrorComponent from "./error/error.component";
import MarketComponent from "./market/market.component";

const routes: Routes = [
  {path: "", component: MarketComponent},
  {path: "checkout", component: CheckoutComponent, canActivate: [CheckoutGuard]},
  {path: "**", component: ErrorComponent, data: {redirect: "/"}},
];

@NgModule({
  providers: [CheckoutGuard],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export default AppRoutingModule;
