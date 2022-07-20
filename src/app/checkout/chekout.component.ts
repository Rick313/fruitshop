import {Component} from "@angular/core";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import BackPackService from "src/features/backpack.service";
import CheckoutService, {
  CreditCardForm,
  DeliveryAddressForm,
} from "src/features/checkout.service";
import NotificationService from "src/features/notification.service";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
  providers: [CheckoutService],
})
export class CheckoutComponent {
  public deliveryValidate: boolean;
  public readonly delivery: DeliveryAddressForm;
  public readonly creditcard: CreditCardForm;
  public readonly years: number[];
  public readonly months: number[];
  public constructor(
    public readonly backpack: BackPackService,
    public readonly checkout: CheckoutService,
    private readonly router: Router,
    private readonly notification: NotificationService,
  ) {
    this.deliveryValidate = false;
    this.delivery = this.checkout.form("delivery-address");
    this.creditcard = this.checkout.form("credit-card");

    const now = new Date();
    this.years = [now.getFullYear()];
    this.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    while (this.years[this.years.length - 1] < this.years[0] + 8) {
      this.years.push(this.years[this.years.length - 1] + 1);
    }
  }

  public submitDevlivery() {
    if (this.delivery.invalid) return;
    this.deliveryValidate = true;
  }

  public submitCreditCard() {
    if (this.delivery.invalid && this.creditcard.invalid) return;
    // Envoyé la commande
    this.backpack.reset();
    this.router.navigate(["/"]);
    this.notification.send({
      title: "Votre commande",
      content: "Votre commande a bien était envoyé",
    });
  }

  public showError(control: FormControl) {
    return control.touched && control.invalid;
  }
}

export default CheckoutComponent;
