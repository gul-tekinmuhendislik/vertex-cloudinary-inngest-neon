# Google Drive/Sheets Setup for Vercel

## 1. Google Cloud Console'da Service Account Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com) açın
2. Projenizi seçin veya yeni proje oluşturun
3. Sol menüden **IAM & Admin** > **Service Accounts** gidin
4. **Create Service Account** tıklayın
5. Service account detayları:
   - Name: `vercel-drive-reader` (veya istediğiniz bir isim)
   - ID: otomatik oluşacak
   - Description: "Service account for Vercel app to read Drive files"
6. **Create and Continue** tıklayın
7. Role eklemek için skip yapabilirsiniz (Drive API'yi kullanacağız)
8. **Done** tıklayın

## 2. Service Account Key Oluşturma

1. Oluşturduğunuz service account'a tıklayın
2. **Keys** sekmesine gidin
3. **Add Key** > **Create new key** tıklayın
4. **JSON** seçin ve **Create** tıklayın
5. JSON dosyası indirilecek - **BU DOSYAYI GÜVENLİ TUTUN**

## 3. API'leri Etkinleştirme

Google Cloud Console'da:

```bash
# Ya da Console'dan:
1. APIs & Services > Enable APIs and Services
2. Arama kutusuna "Google Drive API" yazın ve etkinleştirin
3. Arama kutusuna "Google Sheets API" yazın ve etkinleştirin
```

## 4. Drive Dosyasını Service Account ile Paylaşma

1. Google Drive'da okumak istediğiniz dosya/klasöre gidin
2. Sağ tık > **Share** (Paylaş)
3. Service account email'ini ekleyin: `service-account-name@project-id.iam.gserviceaccount.com`
   - Bu email'i service account detaylarında bulabilirsiniz
4. **Viewer** (Görüntüleyici) yetkisi verin
5. **Send** tıklayın

## 5. Vercel Environment Variables

Vercel Dashboard'da projenize gidin ve Settings > Environment Variables:

### Required Variables:

```bash
# Service Account JSON'ının tamamını tek satır halinde
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"service-account@project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

### JSON'ı Tek Satıra Çevirme:

1. İndirdiğiniz JSON dosyasını açın
2. Tüm içeriği kopyalayın
3. [JSON Minifier](https://www.jsonformatter.org/json-minify) kullanarak tek satıra çevirin
4. Ya da terminal'de: `cat service-account.json | jq -c '.' | pbcopy` (Mac)

## 6. Test Etme

### Local Test:
```bash
# .env.local dosyasına ekleyin
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# Test endpoint
curl http://localhost:3000/api/drive/test
```

### Vercel'de Test:
```bash
# Deploy ettikten sonra
curl https://your-app.vercel.app/api/drive/test
```

## API Endpoints

### Drive Dosyaları Listeleme:
```
GET /api/drive/list
GET /api/drive/list?mimeType=application/json
```

### Dosya Okuma:
```
GET /api/drive/file/[FILE_ID]?type=json
GET /api/drive/file/[FILE_ID]?type=metadata
```

### Google Sheets Okuma:
```
GET /api/sheets?id=SPREADSHEET_ID
GET /api/sheets?id=SPREADSHEET_ID&mode=all
```

## Önemli Notlar

1. **Service Account Email'ini** Drive/Sheets dosyalarıyla paylaşmayı unutmayın!
2. Service account key'i **asla** public repo'ya commitlemeyın
3. Vercel'de environment variable olarak eklerken **tırnak içinde** olmalı
4. JSON key'i minify edilmiş (tek satır) olmalı

## Troubleshooting

### "Permission denied" hatası:
- Service account email'ini dosyayla paylaştığınızdan emin olun

### "API not enabled" hatası:
- Google Cloud Console'da Drive ve Sheets API'lerinin etkin olduğundan emin olun

### "Invalid credentials" hatası:
- JSON key'in doğru formatta olduğundan emin olun
- Environment variable'ın tırnak içinde olduğundan emin olun