import {Component, ElementRef, Renderer2, ViewChild} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {mergeMap, Observable, of, tap} from "rxjs";
import {BackPackService, BackPackItem} from "src/features/backpack.service";
import ProductService, {Product} from "src/features/product.service";
import {Response} from "src/features/shared";

@Component({
  selector: "app-market",
  templateUrl: "/market.component.html",
  styleUrls: ["./market.component.scss"],
})
export class MarketComponent {
  @ViewChild("topbar") public topbar!: ElementRef<HTMLDivElement>;
  @ViewChild("itemchip") public itemchip!: ElementRef<HTMLDivElement>;
  private open: boolean;
  public status?: string;
  public readonly products$: Observable<Response<Product[]>>;
  public constructor(
    public readonly backpack: BackPackService,
    private readonly title: Title,
    private readonly host: ElementRef,
    private readonly product: ProductService,
    private readonly renderer: Renderer2,
    private readonly router: Router,
  ) {
    this.title.setTitle("Fruit shop !");
    this.products$ = of({status: "load", data: []}).pipe(
      tap(({status}) => (this.status = status)),
      mergeMap(() => this.product.load()),
    );
    this.open = false;
  }

  public get items() {
    const items = this.backpack.articles.reduce(
      (acc, {quantity}) => (acc += quantity || 0),
      0,
    );
    return items >= 9 ? "+9" : String(items);
  }

  public ngAfterViewInit(): void {
    this.setTransform(this.topbar);
    const {height} = this.topbar.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(
      this.host.nativeElement,
      "height",
      `calc(100% - ${height.toFixed(2)}px)`,
    );
  }

  public onClickTopBar(_event: MouseEvent) {
    this.setTransform(this.topbar);
  }

  public onClickAddIntoMyBag(_event: MouseEvent, item: BackPackItem) {
    this.backpack.add(item);

    if (!this.open) return;
    setTimeout(() => {
      const element = this.itemchip.nativeElement;
      const classname = "vibrate";
      if (element.classList.contains(classname)) return;
      this.renderer.addClass(element, classname);
      setTimeout(() => this.renderer.removeClass(element, classname), 900);
    });
  }

  public onClickMinusQuantity(_event: MouseEvent, item: BackPackItem) {
    this.backpack.remove(item);
  }

  public onClickPlusQuantity(_event: MouseEvent, item: BackPackItem) {
    this.backpack.add(item);
  }

  public onClickCheckout(_event: MouseEvent) {
    this.router.navigate(["/checkout"]);
  }

  private setTransform(reference: ElementRef<HTMLElement>) {
    const parent = reference.nativeElement.parentElement as HTMLElement;
    let transform = "translateY(0px)";
    if (!this.open) {
      const {height} = reference.nativeElement.getBoundingClientRect();
      transform = `translateY(calc(100% - ${height.toFixed(2)}px))`;
    }
    this.renderer.setStyle(parent, "transform", transform);
    this.open = !this.open;
  }
}

export default MarketComponent;
