import { LocalDataSource } from "./data/localDataSource";

// 非同步的產品資料展示函式 (傳回一個很長的字串)
async function displayData(): Promise<string> {
  // 載入商品與分類資料當成 data store
  let ds = new LocalDataSource();
  // 取得產品物件
  let allProducts = await ds.getProducts("name");
  // 取得產品分類
  let categories = await ds.getCategories();

  // 取出西洋棋商品
  let chessProducts = await ds.getProducts("name", "Chess");
  let result = "";

  // 在字串加入每種產品的名稱和分類
  allProducts.forEach(p => result += `Product: ${p.name}, ${p.category}\n`);
  // 在字串加入所有分類
  categories.forEach(c => result += (`Category: ${c}\n`));
  // 將所有西洋棋產品放入購物車
  chessProducts.forEach(p => ds.order.addProduct(p, 1));
  // 在字串加入購物車總金額
  result += `Order total: $${ds.order.total.toFixed(2)}`;

  return result;
}

// 在Promise有傳回值時印出來
displayData().then(res => console.log(res));