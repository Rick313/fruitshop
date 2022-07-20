import {Injectable} from "@angular/core";
import {Observable, catchError, of} from "rxjs";
import {Response} from "./shared";

export type Product = {
  name: string;
  price: string;
  picture?: string | null;
  description?: string | null;
};

@Injectable({providedIn: "root"})
export class ProductService {
  private products?: Product[];

  /**
   * Retrieve list of fruit
   * Note : Ceci est un Mock
   * TODO : Faire un call a l'api
   */
  public load() {
    return new Observable<Response<Product[]>>((subscriber) => {
      subscriber.next({status: "load", data: []});
      if (this.products) {
        subscriber.next({status: "success", data: this.products});
        subscriber.complete();
      } else {
        const timeout = setTimeout(() => {
          this.products = [
            {name: "Banane", price: "1.35", picture: "/assets/banana.svg"},
            {name: "Orange", price: "0.95", picture: "/assets/orange.svg"},
            {name: "Pomme", price: "2.21", picture: "/assets/apple.svg"},
          ];
          const response: Response<Product[]> = {
            status: "success",
            data: this.products.map((fruit: Product) => {
              if (!fruit.picture) fruit.picture = "";
              if (!fruit.description) fruit.description = "";
              return fruit;
            }),
          };

          subscriber.next(response);
          subscriber.complete();
          clearTimeout(timeout);
        }, 1500);
      }
    }).pipe(
      catchError((error, _caught) => {
        console.log(error);
        return of<Response<Product[]>>({status: "error", data: []});
      }),
    );
  }
}

export default ProductService;
