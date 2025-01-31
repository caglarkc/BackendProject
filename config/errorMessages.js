module.exports = {
    VALIDATION: {
        EMPTY_FIELD: "Bu alan boş bırakılamaz.",
        EMPTY_FIELD_WITH_TYPE: "{type} alanı boş bırakılamaz.",
        INVALID_PHONE: "Geçersiz telefon numarası. 10 haneli olmalıdır.",
        INVALID_EMAIL: "Geçersiz e-posta adresi.",
        INVALID_NUMBER: "Sadece rakam girilmelidir.",
        INVALID_TEXT: "Sadece harf ve boşluk karakterleri girilmelidir.",
        INVALID_NAME: "İsim en az 2 karakter olmalı ve sadece harf içermelidir.",
        INVALID_SURNAME: "Soyad en az 2 karakter olmalı ve sadece harf içermelidir.",
        INVALID_PASSWORD: "Şifre en az 8 karakter olmalı, bir büyük harf, bir küçük harf ve bir rakam içermelidir.",
        INVALID_USER_ID: "Kullanıcı id 24 haneli hexadecimal olmalıdır.",
        INVALID_ADDRESS_ID: "Adres id 24 haneli hexadecimal olmalıdır.",
        INVALID_ADDRESS_NAME: "Adres adı en az 2 karakter olmalıdır.",
        INVALID_USER_ROLE: "Geçersiz kullanıcı rolü.",
        INVALID_USER: "Kullanıcı bulunamadı.",
        INVALID_ADDRESS: "Adres bulunamadı.",
        PASSWORDS_NOT_MATCH: "Şifreler eşleşmiyor.",
        DUPLICATE_EMAIL: "Bu email zaten kullanılıyor.",
        DUPLICATE_PHONE: "Bu telefon numarası zaten kullanılıyor.",
        DUPLICATE_INFOS: "{type} bilgileri aynı.",
        INVALID_LOGIN_DATA: "Lütfen email veya telefon numarasından sadece birini giriniz.",
        MATCH_NOT_FOUND: "Bilgiler eşleşmiyor.",
        EMAIL_NOT_REGISTERED: "Email sistemde kayıtlı değil.",
        PHONE_NOT_REGISTERED: "Telefon numarası sistemde kayıtlı değil."
    },
    AUTH: {
        INVALID_CREDENTIALS: "Email veya şifre hatalı.",
        UNAUTHORIZED: "Bu işlem için yetkiniz yok.",
        TOKEN_EXPIRED: "Oturum süresi doldu.",
        TOKEN_INVALID: "Geçersiz token.",
        USER_NOT_FOUND: "Kullanıcı bulunamadı.",
        WRONG_PASSWORD: "Şifre yanlış.",
        REFRESH_TOKEN_REQUIRED: "Refresh token gerekli.",
        INVALID_REFRESH_TOKEN: "Geçersiz veya süresi dolmuş refresh token."
    },
    NOT_FOUND: {
        USER: "Kullanıcı bulunamadı.",
        RESOURCE: "İstenen kaynak bulunamadı.",
        ADDRESS: "Adres bulunamadı.",
        ORDER: "Sipariş bulunamadı.",
        PRODUCT: "Ürün bulunamadı."
    },
    DATABASE: {
        CONNECTION_ERROR: "Veritabanı bağlantı hatası.",
        QUERY_ERROR: "Veritabanı sorgu hatası.",
        DUPLICATE_KEY: "Bu kayıt zaten mevcut.",
        VALIDATION_ERROR: "Veritabanı doğrulama hatası."
    },
    PERMISSION: {
        UNAUTHORIZED: "Bu işlem için yetkiniz yok."
    },
    RATE_LIMIT: {
        LOGIN_ATTEMPT_LIMIT: "3 kez yanlış giriş yaptınız. Hesabınız kilitlendi.",
        WEEKLY_PASSWORD_CHANGE_LIMIT: "Haftalık şifre değiştirme limitine (3) ulaştınız.",
        WEEKLY_FORGOT_PASSWORD_LIMIT: "Haftalık şifremi unuttum limitine (3) ulaştınız.",
        DAILY_ADDRESS_LIMIT: "Günlük adres ekleme limitine (3) ulaştınız.",
        DAILY_PROFILE_INFO_UPDATE_LIMIT: "Günlük profil bilgi güncelleme limitine (3) ulaştınız.",
        DAILY_PROFILE_LOGIN_UPDATE_LIMIT: "Günlük profil giriş bilgi güncelleme limitine (3) ulaştınız.",
        HOURLY_REQUEST_LIMIT: "Saatlik istek limitine (100) ulaştınız.",
        WEEKLY_REGISTRATION_LIMIT: "Haftalık kayıt limitine (10) ulaştınız.",
        TOO_MANY_REQUESTS: "Çok fazla istek gönderildi."
    }
}; 