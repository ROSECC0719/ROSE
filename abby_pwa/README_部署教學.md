# Abby代購神器 Web App 使用方式

## 手機最快測試
1. 把整個 `abby_pwa` 資料夾上傳到 GitHub Pages、Cloudflare Pages 或 Netlify。
2. 用 iPhone Safari 開啟產生的網址。
3. 按 Safari 分享按鈕。
4. 選「加入主畫面」。
5. 桌面會出現「Abby代購神器」，之後就像 App 一樣打開。

## 不建議的方式
直接在手機打開本機 HTML 檔，有些 iPhone 會擋 Service Worker 或本機儲存，容易不能離線使用。

## 已完成功能
- 日本、韓國、泰國主力報價
- 美國、香港、澳洲、捷克輔助報價
- 極速報價版 + 完整管理版
- 匯率、運費、倍率可自行設定
- 設定會存在手機 localStorage
- 支援 PWA，可加入 iPhone 主畫面
- 基本離線快取

## 上線前必做驗算
請拿妳原本 Google Sheet 的 3-5 筆舊資料，逐一比對：
- 日本成本 / 批價 / 售價
- 韓國空運 / 海運
- 泰國成本 / 批價 / 售價

若數字差異超過四捨五入誤差，需要回來調整公式參數。
