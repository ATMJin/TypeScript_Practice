import { Product, Order } from "./data/entities";

export class DomDisplay {
  // 要用在網頁的資料
  props: {
    products: Product[],
    order: Order;
  };

  getContent(): HTMLElement {
    let elem = document.createElement("h3");
    elem.innerText = this.getElementText();
    elem.classList.add("bg-primary", "text-center", "text-white", "p-2");
    return elem;
  }

  getElementText(): string {
    return `${this.props.products.length} Products, ` + `Order total: $${this.props.order.total}`;
  }
}