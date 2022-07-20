import {Injectable} from "@angular/core";

export type BackPackItem = {
  name: string;
  price: string;
  quantity?: number;
  picture?: string | null;
};

@Injectable({providedIn: "root"})
export class BackPackService {
  /**
   * @type {BackPackItem[]}
   * @memberof BackPackService
   */
  public readonly articles: BackPackItem[] = [
    {name: "Banane", price: "1.35", picture: "/assets/banana.svg", quantity: 1},
  ];

  /**
   * Price total
   * @readonly
   * @memberof BackPackService
   */
  public get total() {
    return this.articles.reduce((acc, {price}) => (acc += Number(price)), 0.0).toFixed(2);
  }

  public getUnitPrice(article: BackPackItem) {
    return (Number(article.price) / (article.quantity || 1)).toFixed(2);
  }

  /**
   * Add an item
   * @param {BackPackItem}
   */
  public add({name, price, picture}: BackPackItem) {
    const find = this.articles.find((x) => x.name === name);
    if (!find || find.quantity === undefined) {
      this.articles.push({name, price, picture, quantity: 1});
      return this.articles;
    }
    price = this.getUnitPrice(find);
    find.quantity++ && (find.price = (Number(price) * find.quantity).toFixed(2));
    return this.articles;
  }

  /**
   * Remove an item
   * @param {BackPackItem}
   */
  public remove({name}: BackPackItem) {
    const find = this.articles.find((x) => x.name === name);
    if (!find || find.quantity === undefined) return this.articles;
    const price = this.getUnitPrice(find);
    if (find.quantity > 1)
      find.quantity-- && (find.price = (Number(find.price) - Number(price)).toFixed(2));
    else this.articles.splice(this.articles.indexOf(find), 1);
    return this.articles;
  }

  /**
   * Remove all items
   */
  public reset() {
    this.articles.splice(0, this.articles.length);
    return this.articles;
  }
}
export default BackPackService;
