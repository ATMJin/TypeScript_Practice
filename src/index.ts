import { LocalDataSource } from "./data/localDataSource";
import { RemoteDataSource } from "./data/remoteDataSource";
import { DomDisplay } from "./domDisplay";
import { HtmlDisplay } from "./htmlDisplay";
import "bootstrap/dist/css/bootstrap.css";

// // 非同步的產品資料展示函式 (傳回一個很長的字串)
// async function displayData(): Promise<string> {
//   // 載入商品與分類資料當成 data store
//   let ds = new LocalDataSource();
//   // 取得產品物件
//   let allProducts = await ds.getProducts("name");
//   // 取得產品分類
//   let categories = await ds.getCategories();

//   // 取出西洋棋商品
//   let chessProducts = await ds.getProducts("name", "Chess");
//   let result = "";

//   // 在字串加入每種產品的名稱和分類
//   allProducts.forEach(p => result += `Product: ${p.name}, ${p.category}\n`);
//   // 在字串加入所有分類
//   categories.forEach(c => result += (`Category: ${c}\n`));
//   // 將所有西洋棋產品放入購物車
//   chessProducts.forEach(p => ds.order.addProduct(p, 1));
//   // 在字串加入購物車總金額
//   result += `Order total: $${ds.order.total.toFixed(2)}`;

//   return result;
// }

// // 在Promise有傳回值時印出來
// displayData().then(res => console.log(res));


// let ds = new LocalDataSource();  // 取得 data store
let ds = new RemoteDataSource();  // 取得 data store

async function displayData(): Promise<HTMLElement> {
  // 建立一個新的 DomDisplay物件
  // let display = new DomDisplay();
  let display = new HtmlDisplay();
  // 設定 DomDisplay 物件的 props 屬性，放入 data store 的產品及訂單物件
  display.props = {
    // products: await ds.getProducts("name"),
    // order: ds.order
    dataSource: ds
  };
  // 傳回 DomDisplay 物件
  return display.getContent();
}

// 在網頁載入狀態改變時觸發
document.onreadystatechange = () => {
  // 若載入完成
  if (document.readyState === "complete") {
    // 呼叫 displayData()
    displayData().then(elem => {
      // 將 displayData() 傳回的 HTML 元素寫到網頁內
      let rootElement = document.getElementById("app");
      rootElement.innerText = "";
      rootElement.appendChild(elem);
    });
  }
};