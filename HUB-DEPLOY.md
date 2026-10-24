# 提案自動上線流程（GitHub → Cloudflare hub）

最後更新：2026-10-25。本文件是正式交接規格，給 Codex（製作提案的人）與之後接手的人看。不含任何金鑰值。

## 一、一句話

在提案倉庫 `Hsulala/report` 的 `hub/<資料夾>/` 放好提案（`index.html`、圖片、`meta.json`），推到 `main`，GitHub Actions 會自動把檔案傳到 Cloudflare 的 hub，並掛到對應客戶的頁面；客戶網址是 `https://hub.kulalab.app/report/<短網址>/`，打開就是提案整頁（沒有外框、沒有客戶頁標頭）。同一個資料夾再推一次，就是覆蓋更新同一份提案，不會變成兩份。

## 二、現況（誰做了什麼、什麼已驗證）

| 項目 | 狀態 |
|---|---|
| hub 支援短網址 `/report/<slug>/`、整頁提案 | 已部署、已驗證（`mdia`、`homoo`、`jingmei` 三位客戶） |
| 部署程式 `scripts/deploy-proposals.js`、meta.json 檢查、覆蓋更新、線上驗證 | 已寫完，單元與整合測試通過（`tests/deploy-proposals.test.js`） |
| 資料庫欄位 `kw_proposals.source_key`、`manifest`（migration `d1/0006`） | 見「三、狀態表」最下方的實際部署紀錄 |
| 提案倉庫的 GitHub Actions 流程檔 | 範本在 `docs/report-repo/deploy-hub.yml`，安裝與 Secrets 設定見第六節 |
| GitHub Secrets | 尚未設定，需要 ULY 自己建立並填入（第六節） |

## 三、倉庫與位置

- hub 程式倉庫：`https://github.com/Hsulala/makarma-operations-console`，分支 `cloudflare`（正式部署用這條）。本機 `/home/claude/makarma-operations-console`。
- 提案製作倉庫：`https://github.com/Hsulala/report`，分支 `main`。本機 `/home/claude/hsulala/report`。
- 部署程式（單檔、不依賴 hub 其他程式）：hub 倉庫 `scripts/deploy-proposals.js`。要原樣複製到提案倉庫的 `tools/deploy-hub.js`；兩邊以 hub 倉庫為準，修改時一起更新。
- 流程檔範本：hub 倉庫 `docs/report-repo/deploy-hub.yml`，安裝到提案倉庫的 `.github/workflows/deploy-hub.yml`。
- Cloudflare：帳號 ID `94a01271f4bf43ee4f642653590c95a6`；Worker `makarma-hub`；D1 `makarma-hub`；R2 bucket `makarma-proposals`；網域 `hub.kulalab.app`（備用 `makarma-hub.yunshyu.workers.dev`）。

## 四、提案倉庫的資料夾規格

```
hub/
  <資料夾名稱>/          小寫英文、數字、連字號，1–49 字，例如 mdia、mdia-2026-12
    meta.json            必要，部署程式讀取，不會被傳到網站
    index.html           入口檔（可用 meta.json 的 entry 改名）
    assets/...           圖片、樣式、script、字型
```

資料夾名稱就是這份提案的識別（同一位客戶底下不可重複）：同名重推＝覆蓋更新同一份；不同名＝另一份提案。同一位客戶有多份時，最新日期的在 `/report/<slug>/`，其餘在 `/report/<slug>/p/<提案 id>/`（提案 id 可在 hub 後台「提案簡報」或部署輸出看到）。

### meta.json（正式 schema）

```json
{
  "client": "美迪亞",
  "title": "搜尋與轉換成長提案",
  "date": "2026-10-20",
  "entry": "index.html",
  "slug": "mdia"
}
```

| 欄位 | 必填 | 規則 |
|---|---|---|
| `client` | 是 | 關鍵字主控台裡的客戶名稱，需完全一致（或填客戶 id）。客戶必須先在 hub 後台建立好，部署不會自動建立客戶；已封存的客戶不能上線。 |
| `title` | 是 | 最多 80 字，顯示在後台提案清單與客戶頁。 |
| `date` | 否 | `YYYY-MM-DD`，沒填用部署當天（台北時間）。決定多份提案的新舊順序。 |
| `entry` | 否 | 入口檔，預設 `index.html`，必須是資料夾內的相對 `.html` 路徑。 |
| `slug` | 否 | 客戶的短網址（設在客戶身上，不是提案身上）：小寫英文、數字、連字號，1–40 字，頭尾不可是連字號，不可與其他客戶重複。第一次上線建議填；之後不填就沿用客戶現有的短網址。 |

不認識的欄位會被拒絕（避免打錯字被默默忽略）。

### 檔案規則（部署程式會檢查，不合就整份拒絕）

- 圖片、樣式、script 全部放在該資料夾內，用相對路徑引用，例如 `assets/logo.png`。不要用 `/assets/...`（開頭有斜線）也不要寫死網域，因為提案頁是放在 `/report/<slug>/` 底下。
- 不要有建置步驟，交出來就是可直接開的靜態檔。Google Fonts 等 https 外部資源可以用。
- 不可有隱藏檔（檔名開頭是點，例如 `.env`）、`..`、反斜線、空白路徑段。
- 單一資料夾總大小上限 80 MB（請壓縮圖片）。
- 不要放金鑰、帳密、內部文件；提案頁會加上不給搜尋引擎收錄的標頭，但有短網址的頁面猜得到，需要保密請在 hub 後台為該客戶設 PIN。
- `meta.json` 是這份提案標題與日期的唯一來源：在 hub 後台改標題或日期後，下次推送會被 meta.json 蓋回去。

## 五、部署行為

1. 觸發：推到 `main` 且 `hub/**` 有變動，或在 Actions 手動執行（可填 `only` 指定資料夾，留空＝全部）。Pull request 只做格式檢查，不上傳。
2. 只上線這次有變動、且資料夾仍存在的提案。刪掉資料夾不會自動下架，請到 hub 後台「提案簡報」按刪除。
3. 每份提案：
   - 驗證 meta.json、檔名、入口檔、大小。
   - 找到客戶、檢查短網址有沒有被別人用。
   - 查 `kw_proposals` 有沒有同客戶、同資料夾名稱（`source_key`）的紀錄：有就覆蓋（沿用同一個 id、同一個 R2 路徑），沒有就新增。
   - 先上傳全部檔案，再更新資料庫紀錄，最後才刪除上次有、這次沒有的舊檔（依 `manifest` 清單）。中途失敗最多多留舊檔，客戶不會看到壞掉的頁面。
   - 設定客戶短網址（meta.json 有填 slug 才寫入）。
4. 部署後驗證：用 `https://hub.kulalab.app/report/<slug>/p/<提案 id>/` 開頁面，要回 200 且有內容，並逐一檢查頁面裡引用的相對檔案（圖片、樣式、script、字型、影片）都讀得到。任何一項失敗，該份提案顯示失敗、整個流程標為失敗。有 PIN 的客戶會被導去輸入頁，只能標示「略過驗證」；客戶沒有短網址時也略過驗證。
5. hub 沒更新到支援版本時（缺資料庫欄位），部署會直接說明原因並停止，不會半套上線。

本機手動執行（需要 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 環境變數）：

```
node tools/deploy-hub.js --root . --dry-run            # 只檢查格式
node tools/deploy-hub.js --root . --only mdia          # 上線指定資料夾
node tools/deploy-hub.js --root .                      # hub/ 底下全部
```

舊的手動指令 `scripts/add-proposal.js`（hub 倉庫）仍可用，但它每次都新增一份、不會覆蓋，也不記資料夾名稱；自動流程上線後請改用新流程。

## 六、需要 ULY 親自做的設定（只有名稱，不要把值貼給任何人或 AI）

### 6-1 建立 Cloudflare API Token

Cloudflare 後台 → My Profile → API Tokens → Create Token → Custom token：

- 權限（Permissions）：
  - Account → Workers R2 Storage → Edit
  - Account → D1 → Edit
- 帳號範圍（Account Resources）：Include → 選自己的帳號。
- 其餘不要加。建議名稱 `report-hub-deploy`。
- 注意：這組最小權限尚未在實際流程中試過；若第一次上線出現 authentication 或 permission 錯誤，把錯誤訊息貼給 Claude 或 Codex，再決定是否補權限，不要直接給整個帳號的完整權限。

### 6-2 設定 GitHub Secrets（提案倉庫 `Hsulala/report`）

倉庫 → Settings → Secrets and variables → Actions：

| 類型 | 名稱 | 內容 |
|---|---|---|
| Repository secret | `CLOUDFLARE_API_TOKEN` | 6-1 建立的 Token（自己貼上） |
| Repository secret | `CLOUDFLARE_ACCOUNT_ID` | `94a01271f4bf43ee4f642653590c95a6` |
| Repository variable（選填） | `HUB_BASE_URL` | 預設 `https://hub.kulalab.app`，不設也行 |

### 6-3 安裝流程檔與部署程式到提案倉庫

- `tools/deploy-hub.js`：複製 hub 倉庫的 `scripts/deploy-proposals.js`。
- `.github/workflows/deploy-hub.yml`：複製 hub 倉庫的 `docs/report-repo/deploy-hub.yml`。

## 七、已驗證與待完成

已驗證：
- 單元與整合測試：meta.json 檢查、資料夾檢查、新增、同資料夾覆蓋（id 不變、舊檔清除）、同客戶多份提案順序、客戶不存在、短網址重複、引用檔案缺漏、PIN 客戶、`--dry-run`（`tests/deploy-proposals.test.js`，`TEST_DB=d1`）。
- 短網址整頁：三位客戶在 `hub.kulalab.app` 與 `workers.dev` 都回 200，頁面引用檔案都讀得到。

待完成：
1. ULY 建立 Token、設定 GitHub Secrets（第六節）。
2. 把流程檔與 `tools/deploy-hub.js` 放進提案倉庫（若 Claude 沒有該倉庫的推送權限，由 Codex 或 ULY 放入）。
3. 第一次由 GitHub 實際跑一次，確認 Actions 環境（Node 22、`npx wrangler@4`、最小權限 Token）可用。
4. 既有三份提案（美迪亞、和畝水產、靖美眼鏡）若要改由 GitHub 管理：把它們放進 `hub/<資料夾>/` 並補 `meta.json`，資料夾名稱要與下表一致，才會覆蓋原有那一份而不是新增。
5. 刪除舊的 Cloudflare Token（`81kaG6…`、`xxInST…`），並重新產生先前外洩的 secrets（`GOOGLE_ADS_CLIENT_SECRET`、`GOOGLE_ADS_REFRESH_TOKEN`、`NOTION_TOKEN`、`TELEGRAM_BOT_TOKEN`）。

### 既有三份提案的資料夾名稱對照（已登記 source_key）

| 客戶 | 資料夾名稱 | 客戶短網址 |
|---|---|---|
| 美迪亞 | `mdia` | `mdia` |
| 和畝水產 | `homoo` | `homoo` |
| 靖美眼鏡 | `jingmei` | `jingmei` |

注意：這三份是手動上傳的，沒有留下檔案清單（`manifest`）。第一次由 GitHub 覆蓋它們時，舊檔不會自動清除（新檔會覆蓋同名檔案），之後就正常。

## 八、給 Codex：製作提案時先固定這些

- 輸出資料夾 `hub/<資料夾名稱>/`，內有 `index.html`、`assets/`、`meta.json`，規格見第四節。
- 客戶要先由 ULY 在 hub 後台建立，名稱與 `meta.json` 的 `client` 完全一致。
- 推到 `main` 後，到 GitHub Actions 看 `Deploy proposals to hub`：綠色代表已上線且驗證通過，輸出會列出客戶網址；紅色就看哪一份、哪一項失敗，修正後再推一次。
- 改版就改同一個資料夾再推；新一期提案用新資料夾名稱（例如 `mdia-2026-12`），日期晚的會成為 `/report/<slug>/` 預設顯示的那份。
- 不要自己建立或貼出任何 Token、密碼。
