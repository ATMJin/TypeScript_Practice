import { Product,Order } from "./data/entities";
import { createElement } from "./tools/jsxFactory";

export class HtmlDisplay{
  props:{
    products:Product[],
order:Order
  }

getContent():HTMLElement{
  return <h3 className="bg-dark text-center text-white p-2">{this.getElementText()}</h3>
}

getElementText():string{
  return `${this.props.products.length} Products, ` + `Order total: $${this.props.order.total}`;
}

}