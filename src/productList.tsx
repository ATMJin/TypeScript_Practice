import { createElement } from "./tools/jsxFactory";
import { Product } from "./data/entities";
import { ProductItem } from "./productItem";
import { CategoryList } from "./categoryList";
import { addClass } from "./decorators";

export class ProductList {
  props: {
    products: Product[],
    categories: string[],
    selectedCategory: string,
    addToOrderCallback?: (product: Product, quantity: number) => void,
    filterCallback?: (category: string) => void;
  };

  // 對<select>加入兩個新的class
  @addClass("select", "bg-info", "m-1")
  getContent(): HTMLElement {
    return <div className="container-fluid">
      <div className="row">
        <div className="col-3 p-2">
          <CategoryList categories={this.props.categories} selectedCategory={this.props.selectedCategory} callback={this.props.filterCallback}></CategoryList>
        </div>
        <div className="col-9 p-2">
          {this.props.products.map(p => <ProductItem product={p} callback={this.props.addToOrderCallback}></ProductItem>)}
        </div>
      </div>
    </div>;
  }
}