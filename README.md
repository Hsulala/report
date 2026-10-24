# report

客戶 SEO 提案網站的原始檔。

- 要上線到 hub（`https://hub.kulalab.app/report/<短網址>/`）的提案，放在 `hub/<資料夾>/`，規格與自動上線流程見 [HUB-DEPLOY.md](HUB-DEPLOY.md)。
- 部署程式在 `tools/deploy-hub.js`，流程檔在 `.github/workflows/deploy-hub.yml`（來源與正本在 `Hsulala/makarma-operations-console` 的 `scripts/deploy-proposals.js`、`docs/report-repo/deploy-hub.yml`、`docs/PROPOSAL-PIPELINE.md`，修改時兩邊一起更新）。
- 根目錄的 `index.html`、`mdia/` 是舊的放法，未納入自動上線。
