# Project Setup Guide

## Backend (Laravel)
1. Install dependencies
```bash
cd backend
composer install
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

4. Run the server
```bash
php artisan serve
```

### Verify Auth Endpoints
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"ahmed","phone_number":"0555555555","email":"ahmed@example.com","password":"secret123"}'

curl -X POST http://localhost:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ahmed@example.com","password":"secret123"}'
```

### Ngrok
```bash
ngrok http 8000
```
Update `BASE_URL` in `src/constants/api.js` with the ngrok URL.

## Frontend
```bash
npm install
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
