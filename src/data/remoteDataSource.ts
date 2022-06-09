import { AbstractDataSource } from "./abstractDataSource";
import { Product, Order } from "./entities";
import Axios from 'axios';

// 網路服務伺服器資訊
// const protocol = "http";
// const hostname = "localhost";
// const port = 4600;
const urls = {
  // products: `${protocol}://${hostname}:${port}/products`,
  // orders: `${protocol}://${hostname}:${port}/orders`,
  products: "/api/products",
  orders: "/api/orders",
};

// 繼承AbstractDataSource類別並實作抽象方法
export class RemoteDataSource extends AbstractDataSource {
  loadProducts(): Promise<Product[]> {
    // 用Axios向網路服務取得產品資料
    return Axios.get(urls.products)
      .then(res => res.data);
  }

  storeOrder(): Promise<number> {
    // 把order(購物車)內的產品與數量轉成要存入網路服務的形式
    let orderData = {
      lines: [...this.order.orderLines.values()].map(ol => ({
        productId: ol.product.id,
        productName: ol.product.name,
        quantity: ol.quantity
      }))
    };

    // 用Axios將資料寫入網路服務，取得訂單ID
    return Axios.post(urls.orders, orderData)
      .then(res => res.data.id);
  }
}