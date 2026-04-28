# CD Android + Firebase — checklist (ngoài code)

Workflow: `.github/workflows/cd-android-firebase.yml`.

## 0. Lỗi: `Missing google-services.json source` (profile `preview` / env `development`)

Workflow cần **một** nguồn: Base64 secret, hoặc file `.gpg` + passphrase. Bạn chưa tạo / tạo sai **tên** hoặc đặt **chỉ** trong Environment mà job `development` không thấy.

### Cách nhanh nhất — **Repository secret** `GOOGLE_SERVICES_JSON_BASE64` (khuyến nghị)

Dùng **chung** cho cả preview và production nếu chỉ có **một** file `google-services.json`.

1. Lấy file `google-services.json` từ Firebase Console (Project settings → Your apps → Android → `google-services.json`).
2. Trên máy bạn, tạo chuỗi Base64 **một dòng** (không xuống dòng trong ô secret):
   - **Linux / Git Bash trên CI-style:**

     ```bash
     base64 -w 0 config/google-services.json
     ```

   - **macOS:**

     ```bash
     base64 -i config/google-services.json | tr -d '\n'
     ```

3. Trên GitHub repo: **Settings → Secrets and variables → Actions**.
4. Mở tab **Secrets** → **New repository secret** (quan trọng: **Repository**, không chỉ trong Environment).
5. **Name:** `GOOGLE_SERVICES_JSON_BASE64`
6. **Secret:** dán **toàn bộ** chuỗi base64 (rất dài, một dòng).
7. Save → chạy lại workflow (**Actions** → workflow **CD - Android + Firebase** → **Re-run jobs** hoặc push/commit mới).

### CLI (thay UI)

```bash
base64 -w 0 config/google-services.json | gh secret set GOOGLE_SERVICES_JSON_BASE64
# macOS:
# base64 -i config/google-services.json | tr -d '\n' | gh secret set GOOGLE_SERVICES_JSON_BASE64
```

### Hai app Firebase khác nhau (preview vs production)

Tạo **hai** repository secrets:

| Secret | Khi nào dùng |
|--------|----------------|
| `GOOGLE_SERVICES_JSON_BASE64_PREVIEW` | Build profile **preview** (GitHub env `development`) |
| `GOOGLE_SERVICES_JSON_BASE64_PRODUCTION` | Build profile **production** |

Workflow ưu tiên đúng profile rồi mới fallback `GOOGLE_SERVICES_JSON_BASE64`.

### File quá lớn (> ~48 KB secret)

Làm theo [GitHub: Storing large secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets#storing-large-secrets): mã hóa `gpg`, commit `config/google-services.json.gpg`, thêm repository secret `GOOGLE_SERVICES_GPG_PASSPHRASE`.

### Vì sao đã thêm secret mà vẫn lỗi?

| Nguyên nhân | Cách xử lý |
|-------------|------------|
| Secret chỉ tạo trong **Environment** `production`, job preview dùng env **`development`** | Thêm **Repository secret** (áp dụng mọi env) **hoặc** thêm cùng tên secret trong env **`development`**. |
| Sai tên (typo) | Đúng tên: `GOOGLE_SERVICES_JSON_BASE64` hoặc `_PREVIEW` / `_PRODUCTION`. |
| Base64 có xuống dòng / thiếu padding | Workflow tự `tr -d` khoảng trắng/xuống dòng và thêm `=` trước `base64 -d`. Vẫn lỗi → tạo lại Base64 một dòng (mục trên). |
| Dán **cả file JSON** vào secret | Cho phép: nếu parse được là JSON và bắt đầu bằng `{` thì ghi thẳng `config/google-services.json`. |

---

## 1. Luồng workflow (tóm tắt)

| Bước | Việc làm |
|------|-----------|
| `resolve-config` | Chọn **EAS profile** `preview` hoặc `production`, map sang **GitHub Environment** `development` hoặc `production`. |
| `build-apk` | Cài deps, tạo `config/google-services.json`, chạy `eas build --local` → `build.apk`, upload artifact. |
| `distribute-firebase` | Tải APK, gửi lên Firebase App Distribution. |

**Chọn profile khi push:**

- Branch **`feat/practice-one`** (đổi trong workflow nếu bạn dùng branch release khác) → profile **`production`**.
- Mọi branch `on.push` khác trong danh sách → **`preview`**.
- **`workflow_dispatch`**: chọn `preview` / `production` ghi đè.

**Lưu ý tên:** GitHub Environment tên **`development`** được dùng cho build **preview** (EAS profile `preview`). Đừng nhầm với “môi trường Strapi dev” — chỉ là tên Environment trên GitHub.

---

## 2. GitHub — Environments (bắt buộc khớp workflow)

Tạo **hai** environment: **`development`** và **`production`**.

**Settings → Environments**

- [ ] **`development`**: dùng cho job khi EAS profile = preview (push branch không phải production release).
- [ ] **`production`**: dùng khi EAS profile = production.

**Kiểm tra:**

- [ ] **Protection rules**: Nếu bật “Required reviewers”, workflow **chờ duyệt** trước khi build — hoặc tắt cho CD, hoặc duyệt kịp thời.
- [ ] **Deployment branches**: Cho phép branch bạn push (ví dụ `feat/handle-expo-github-action`) hoặc “All branches”.

---

## 3. GitHub — Variables (repository)

**Settings → Secrets and variables → Actions → Variables** (tab **Variables**)

| Variable | Ghi chú |
|----------|---------|
| `EXPO_PUBLIC_API_BASE_URL` | URL API (giống `.env.local`) — **bắt buộc** cho bundle đúng backend. |
| `EXPO_PUBLIC_STRAPI_BASE_URL` | Base Strapi — **bắt buộc**. |
| `LOAD_STORYBOOK` | `true` / `false` — nên set rõ (tránh để trống). |
| `FIREBASE_TESTERS_GROUP` | Tên group tester trên Firebase App Distribution (khớp Console). |

---

## 4. GitHub — Secrets (repository khuyến nghị)

**Settings → Secrets and variables → Actions → Secrets**

| Secret | Mục đích |
|--------|-----------|
| `EXPO_TOKEN` | Token Expo (`eas whoami` / expo.dev → Access Token). |
| `GOOGLE_SERVICES_JSON_BASE64` | **Hoặc** dùng `_PREVIEW` / `_PRODUCTION`, **hoặc** `*.gpg` — xem bước 6. |
| `FIREBASE_APP_ID_ANDROID` | App ID Firebase (Settings → Your apps → Android). |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Toàn bộ JSON service account có quyền App Distribution (một dòng / paste nguyên file). |

Secrets đặt ở **Repository** (không chỉ Environment) để **một** secret dùng cho cả hai Environment trừ khi bạn cố tình tách theo env.

---

## 5. Expo / EAS (đã có trong repo)

- [ ] `eas.json` có profile **`preview`** và **`production`** với `android.buildType: "apk"` (đã có).
- [ ] Project đã `eas login` / link: `app.config.js` có `EAS_PROJECT_ID` đúng project expo.dev.
- [ ] Máy CI chạy `eas build --local` — không cần máy Mac; Android build trên Linux runner là hợp lệ.

---

## 6. `google-services.json` (Android + Firebase)

Chọn **một** cách:

1. **Repository secret** `GOOGLE_SERVICES_JSON_BASE64` (file base64, **Linux**: `base64 -w 0 config/google-services.json`).
2. Hoặc **`GOOGLE_SERVICES_JSON_BASE64_PREVIEW`** / **`GOOGLE_SERVICES_JSON_BASE64_PRODUCTION`** nếu hai app Firebase khác nhau.
3. Hoặc file lớn: commit **`config/google-services.json.gpg`** + secret **`GOOGLE_SERVICES_GPG_PASSPHRASE`** ([GitHub: large secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets#storing-large-secrets)).

- [ ] File JSON sau decode là **JSON hợp lệ** (workflow đã kiểm tra).
- [ ] Biến **`GOOGLE_SERVICES_JSON`** được export sau bước materialise — EAS/Gradle đọc theo script local của bạn / `app.config.js` (`googleServicesFile`).

---

## 7. Firebase App Distribution

- [ ] App Android đã thêm trong Firebase project.
- [ ] Service account có role phù hợp (thường **Firebase App Distribution Admin** hoặc Editor phạm vi project).
- [ ] Group tester trong **`FIREBASE_TESTERS_GROUP`** tồn tại trong Firebase App Distribution.

---

## 8. Trước khi merge / push

- [ ] `PROD_BRANCH_REF` trong workflow (`refs/heads/feat/practice-one`) đúng branch bạn muốn coi là **production**.
- [ ] Branch của bạn nằm trong `on.push.branches` của workflow.
- [ ] Chạy **`eas build --profile preview --local`** (hoặc production) **trên máy** một lần để bắt lỗi cấu hình trước CI.

---

## 9. Khi workflow fail — tra nhanh

| Hiện tượng | Hướng xử lý |
|------------|-------------|
| Thiếu `google-services` | Thêm một trong các secret / `.gpg` ở mục 6. |
| `EXPO_PUBLIC_*` rỗng trong log summary | Thêm Variables ở mục 3. |
| Job chờ mãi “Waiting” | Environment có **required reviewers** — duyệt hoặc đổi rule. |
| Firebase upload fail | Kiểm tra JSON service account, `FIREBASE_APP_ID_ANDROID`, group tester. |
| `eas build` fail | Xem log Gradle/EAS; thường do signing, SDK, hoặc `eas.json` profile. |

---

## 10. Bảo mật

- Không commit `google-services.json` plaintext (repo đã gitignore `config/google-services.json` khi dùng secret/GPG).
- Không in nội dung secret trong log (workflow không `cat` file nhạy cảm).
