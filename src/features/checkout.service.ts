import {Injectable} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map} from "rxjs";

type FG<T> = FormGroup<{
  [K in keyof T]: T[K] extends string | number | boolean
    ? FormControl<T[K] | null>
    : FG<T[K]>;
}>;

export type CreditCard = {
  numbers: string;
  code: string;
  expire: {month: number; year: number};
};

export type DeliveryAddress = {
  city: string;
  street: string;
  zipcode: string;
  phone: string;
  email: string;
};
export type DeliveryAddressForm = FG<DeliveryAddress>;
export type CreditCardForm = FG<CreditCard>;

@Injectable()
export class CheckoutService {
  public constructor(private readonly formbuilder: FormBuilder) {}

  public form(key: "delivery-address"): DeliveryAddressForm;
  public form(key: "credit-card"): CreditCardForm;
  public form(key: string): never;
  public form(key: string): DeliveryAddressForm | CreditCardForm {
    const {pattern, required, max, min, maxLength, minLength, email} = Validators;
    if (key === "delivery-address") {
      // prettier-ignore
      const form = this.formbuilder.group({city: "", street: "", zipcode: "", phone: "", email: ""});
      form.controls.city.addValidators([required, pattern(/[a-zA-Z\s]/)]);
      form.controls.street.addValidators([required]);
      form.controls.zipcode.addValidators([required]);
      form.controls.email.addValidators([required, email]);
      form.controls.phone.addValidators([required]);
      return form;
    }
    if (key === "credit-card") {
      const expire = this.formbuilder.group({month: 1, year: 2022});
      const form = this.formbuilder.group({
        code: "123",
        numbers: "1234456712346789",
        expire,
      });
      expire.controls.month.addValidators([required, min(1), max(12)]);
      expire.controls.year.addValidators([required]);
      form.controls.code.addValidators([required, minLength(3), maxLength(3)]);
      form.controls.numbers.addValidators([required]);
      return form;
    }
    throw new Error(`Form ${key} not exist.`);
  }
}

export default CheckoutService;
