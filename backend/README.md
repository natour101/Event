# Event Backend (Laravel)

## Requirements
- PHP 8.2+
- Composer
- MySQL 8+

## Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Update `.env` with your database credentials.

### Migrate
```bash
php artisan migrate
```

### Run
```bash
php artisan serve
```

## Authentication Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Register payload
```json
{
  "username": "ahmed",
  "phone_number": "0555555555",
  "email": "ahmed@example.com",
  "password": "secret123"
}
```

## Device Token
- `POST /api/device/token`

Payload:
```json
{
  "token": "FCM_TOKEN",
  "platform": "android"
}
```

## Notifications
Set FCM credentials in `.env`:
- `FCM_SERVER_KEY`
- `FCM_SENDER_ID`
- `FCM_PROJECT_ID`

The backend uses `NotificationService` to send a basic FCM notification.

## Postman
Use `docs/postman_collection.json` for a ready collection.
