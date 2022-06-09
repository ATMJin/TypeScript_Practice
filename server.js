const express = require("express")
const jsonServer = require('json-server');

// 設定Express處理URL "/"
const app = express()
app.use("/", express.static("dist"))
app.use("/", express.static("assets"))

// 設定 Express 使用 json-server 來處理URL "/api"
const router = jsonServer.router("data.json")
app.use(jsonServer.bodyParser)
app.use("/api", (req, resp, next) => router(req, resp, next))

// 在指定的 port 啟動 Express 伺服器
const port = process.argv[3] || 4000
app.listen(port, () =>
  console.log(`Running on port ${port}`)
)