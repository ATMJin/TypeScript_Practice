// import { Product, Order } from "./data/entities";
// import { createElement } from "./tools/jsxFactory";

// export class HtmlDisplay {
//   props: {
//     products: Product[],
//     order: Order;
//   };

//   getContent(): HTMLElement {
//     return <h3 className="bg-dark text-center text-white p-2">{this.getElementText()}</h3>;
//   }

//   getElementText(): string {
//     return `${this.props.products.length} Products, ` + `Order total: $${this.props.order.total}`;
//   }
// }


import { Product, Order } from "./data/entities";
import { createElement } from "./tools/jsxFactory";
import { AbstractDataSource } from "./data/abstractDataSource";
import { ProductList } from "./productList";

export class HtmlDisplay {
  private containerElem: HTMLElement;
  private selectedCategory: string;

  constructor() {
    this.containerElem = document.createElement("div");
  }

  props: {
    dataSource: AbstractDataSource;
  };

  async getContent(): Promise<HTMLElement> {
    await this.updateContent();
    return this.containerElem;
  }

  async updateContent() {
    // 取得產品資料
    let products = await this.props.dataSource.getProducts("id", this.selectedCategory);
    // 取得產品分類
    let categories = await this.props.dataSource.getCategories();
    // 清空index.html上div的內容
    this.containerElem.innerHTML = "";

    let content = <div>
      <ProductList products={products} categories={categories}
        selectedCategory={this.selectedCategory}
        addToOrderCallback={this.addToOrder}
        filterCallback={this.selectCategory}></ProductList>
    </div>;

    this.containerElem.appendChild(content);
  }

  addToOrder = (product: Product, quantity: number) => {
    this.props.dataSource.order.addProduct(product, quantity);
    this.updateContent();
  };

  selectCategory = (selected: string) => {
    this.selectedCategory = selected === "All" ? undefined : selected;
    this.updateContent();
  };
}