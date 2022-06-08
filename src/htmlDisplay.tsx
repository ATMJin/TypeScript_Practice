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
import { Header } from "./header";
import { OrderDetails } from "./orderDetails";
import { Summary } from "./summary";

enum DisplayMode {
  // 畫面顯示模式: 產品清單、訂單確認、訂購成功
  List, Details, Complete
}

export class HtmlDisplay {
  private containerElem: HTMLElement;
  private selectedCategory: string;
  // 紀錄畫面模式
  private mode: DisplayMode = DisplayMode.List;
  // 送出的訂單編號
  private orderId: number;

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

    // let content = <div>
    //   <ProductList products={products} categories={categories}
    //     selectedCategory={this.selectedCategory}
    //     addToOrderCallback={this.addToOrder}
    //     filterCallback={this.selectCategory}></ProductList>
    // </div>;

    // this.containerElem.appendChild(content);

    let contentElem: HTMLElement;

    switch (this.mode) {
      case DisplayMode.List:
        contentElem = <div>
          <Header
            order={this.props.dataSource.order}
            submitCallback={this.showDetails}></Header>
          <ProductList
            products={products}
            categories={categories}
            selectedCategory={this.selectedCategory}
            addToOrderCallback={this.addToOrder}
            filterCallback={this.selectCategory}></ProductList>
        </div>;
        break;

      case DisplayMode.Details:
        contentElem = <OrderDetails
          order={this.props.dataSource.order}
          cancelCallback={this.showList}
          submitCallback={this.submitOrder}></OrderDetails>;
        break;

      case DisplayMode.Complete:
        contentElem = <Summary
          orderId={this.orderId}
          callback={this.showList}></Summary>;
        break;
    }

    // 將上面的網頁內容寫入index.html的<div>
    this.containerElem.appendChild(contentElem);
  }

  addToOrder = (product: Product, quantity: number) => {
    this.props.dataSource.order.addProduct(product, quantity);
    this.updateContent();
  };

  selectCategory = (selected: string) => {
    this.selectedCategory = selected === "All" ? undefined : selected;
    this.updateContent();
  };

  // 選擇顯示產品清單
  showList = () => {
    this.mode = DisplayMode.List;
    this.updateContent();
  };

  // 選擇顯示購物車細節
  showDetails = () => {
    this.mode = DisplayMode.Details;
    this.updateContent();
  };

  // 選擇顯示訂購成功畫面
  submitOrder = () => {
    this.props.dataSource.storeOrder()
      .then(id => {
        this.orderId = id;
        this.props.dataSource.order = new Order();
        this.mode = DisplayMode.Complete;
        this.updateContent();
      });
  };
}