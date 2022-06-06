// 產品型別
export type Product = {
  id: number,
  name: string,
  description: string,
  category: string,
  price: number;
};

// 單一選購產品的紀錄類別
export class OrderLine {
  // 屬性:產品物件及其數量
  constructor(public product: Product, public quantity: number) { }
  // 傳回此一產品的總購買金額
  get total(): number {
    return this.product.price * this.quantity;
  }
}

// 購物車
export class Order {
  // 屬性:Map, 用產品id違建對應到OrderLine物件
  private lines = new Map<number, OrderLine>();

  constructor(initialLines?: OrderLine[]) {
    if (initialLines) {
      initialLines.forEach(ol => this.lines.set(ol.product.id, ol));
    }
  }

  // 方法:對某個選購產品追加數量(數量若給0則刪除該選購產品)
  public addProduct(prod: Product, quantity: number) {
    if (this.lines.has(prod.id)) {
      if (quantity === 0) {
        this.removeProduct(prod.id);
      } else {
        this.lines.get(prod.id)!.quantity += quantity;
      }
    } else {
      this.lines.set(prod.id, new OrderLine(prod, quantity));
    }
  }

  // 方法:移除一樣選購產品
  public removeProduct(id: number) {
    this.lines.delete(id);
  }

  // getter屬性:傳回所有選購產品
  get orderLines(): OrderLine[] {
    return [...this.lines.values()];
  }

  // getter屬性:傳回購物車的產品總數
  get productCount(): number {
    return [...this.lines.values()]
      .reduce((total, ol) => total += ol.quantity, 0);
  }

  // getter屬性:傳回所有產品總金額
  get total(): number {
    return [...this.lines.values()]
      .reduce((total, ol) => total += ol.total, 0);
  }
}