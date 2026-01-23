# Project Setup Guide

## Backend (Laravel)
1. Install dependencies
```bash
cd backend
composer install
composer dump-autoload
```

2. Configure environment
```bash
cp .env.example .env
php artisan key:generate
```

3. Configure database credentials in `.env` and run migrations
```bash
php artisan migrate --seed
php artisan storage:link
```

> If you previously had a duplicate migration named
> `2026_01_23_144048_create_personal_access_tokens_table.php`, delete it and clear the migration record:
> ```bash
> rm -f database/migrations/2026_01_23_144048_create_personal_access_tokens_table.php
> php artisan migrate:rollback --step=1
> php artisan migrate --seed
> ```

4. Run the server
```bash
php artisan serve
```

### Verify Auth Endpoints
```bash
curl -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"ahmed\",\"phone_number\":\"0555555555\",\"email\":\"ahmed@example.com\",\"password\":\"secret123\"}"

curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"ahmed@example.com\",\"password\":\"secret123\"}"
```

### Windows PowerShell examples
```powershell
curl -Method POST http://localhost:8000/api/auth/register -ContentType "application/json" -Body '{"username":"ahmed","phone_number":"0555555555","email":"ahmed@example.com","password":"secret123"}'
curl -Method POST http://localhost:8000/api/auth/login -ContentType "application/json" -Body '{"email":"ahmed@example.com","password":"secret123"}'
```

### Windows CMD example (multi-line)
```cmd
curl -X POST http://localhost:8000/api/events ^ 
  -H "Authorization: Bearer TOKEN" ^ 
  -H "Content-Type: application/json" ^ 
  -d "{\"title\":\"Riyadh Music Festival\",\"location\":\"Riyadh Boulevard\"}"
```

### Windows cleanup for duplicate migration (CMD)
```cmd
del database\\migrations\\2026_01_23_144048_create_personal_access_tokens_table.php
php artisan migrate:rollback --step=1
php artisan migrate --seed
```

### Ngrok
```bash
ngrok http 8000
```
Update `BASE_URL` in `src/constants/api.js` with the ngrok URL.

## Frontend
```bash
npm install
npm start -- --reset-cache
npm run android
```

### FCM (Android)
1. Add `google-services.json` to `android/app`.
2. Ensure `@react-native-firebase/app` and `@react-native-firebase/messaging` are installed.
3. Run the app and call the `/api/device/token` endpoint with the generated token.

## Android Release
1. Generate keystore
```bash
keytool -genkeypair -v -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 \
  -alias event-release -keystore android/app/event-release.keystore
```

2. Add to `android/gradle.properties`
```
EVENT_RELEASE_STORE_FILE=event-release.keystore
EVENT_RELEASE_KEY_ALIAS=event-release
EVENT_RELEASE_STORE_PASSWORD=your_password
EVENT_RELEASE_KEY_PASSWORD=your_password
```

3. Update `android/app/build.gradle`
```
signingConfigs {
  release {
    storeFile file(EVENT_RELEASE_STORE_FILE)
    storePassword EVENT_RELEASE_STORE_PASSWORD
    keyAlias EVENT_RELEASE_KEY_ALIAS
    keyPassword EVENT_RELEASE_KEY_PASSWORD
  }
}
```

4. Build release
```bash
cd android
./gradlew assembleRelease
```
