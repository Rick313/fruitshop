import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";

import NotificationService from "src/features/notification.service";
import ProductService from "src/features/product.service";
import BackPackService from "src/features/backpack.service";

import AppRoutingModule from "./app-routing.module";
import AppComponent from "./root/app.component";
import MarketComponent from "./market/market.component";
import CheckoutComponent from "./checkout/chekout.component";

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, AppRoutingModule],
  declarations: [AppComponent, MarketComponent, CheckoutComponent],
  providers: [NotificationService, BackPackService, ProductService],
  bootstrap: [AppComponent],
})
export class AppModule {}
