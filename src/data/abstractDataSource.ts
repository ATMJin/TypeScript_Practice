import { Product, Order } from './entities';
import { minimumValue } from "../decorators";

export type ProductProp = keyof Product;

// 資料來源的抽象類別
export abstract class AbstractDataSource {
  private _products: Product[];  // 產品清單
  private _categeories: Set<string>;  // 產品分類 (Set,元素為字串)
  public order: Order;  // 購物車
  public loading: Promise<void>;  // 資料來源是否讀取完畢

  constructor() {
    this._products = [];
    this._categeories = new Set<string>();
    this.order = new Order();
    this.loading = this.getData();
  }

  // 從來源讀入產品與分類資料
  protected async getData(): Promise<void> {
    this._products = [];
    this._categeories.clear();
    const rawData = await this.loadProducts();
    rawData.forEach(p => {
      this._products.push(p);
      this._categeories.add(p.category);
    });
  }

  // 傳回產品列表 (呼叫 selectProducts(), 根據產品id和指定分類排序)
  @minimumValue("price", 30)  // 產品價格最低必為$30
  async getProducts(sortProp: ProductProp = "id"
    , category?: string): Promise<Product[]> {
    await this.loading;
    return this.selectProducts(this._products, sortProp, category);
  }

  // 根據指定的產品屬性排序，傳回符合指定分類的產品列表
  protected selectProducts(prods: Product[],
    sortProp: ProductProp,
    category?: string): Product[] {
    return prods.filter(p => category === undefined || p.category === category)
      .sort((p1, p2) => p1[sortProp] < p2[sortProp] ?
        -1 : p1[sortProp] > p2[sortProp] ?
          1 : 0);
  }

  // 傳回產品分類
  async getCategories(): Promise<string[]> {
    await this.loading;
    return [...this._categeories.values()];
  }

  // 得由子類別實作的方法
  // 載入產品資料
  protected abstract loadProducts(): Promise<Product[]>;
  // 儲存訂單
  abstract storeOrder(): Promise<number>;
}