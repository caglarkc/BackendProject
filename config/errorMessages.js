module.exports = {
    VALIDATION: {
        EMPTY_FIELD: "Bu alan boş bırakılamaz.",
        INVALID_PHONE: "Geçersiz telefon numarası. 10 haneli olmalıdır.",
        INVALID_EMAIL: "Geçersiz e-posta adresi.",
        INVALID_NUMBER: "Sadece rakam girilmelidir.",
        INVALID_TEXT: "Sadece harf ve boşluk karakterleri girilmelidir.",
        INVALID_NAME: "İsim en az 2 karakter olmalı ve sadece harf içermelidir.",
        INVALID_PASSWORD: "Şifre en az 8 karakter olmalı, bir büyük harf, bir küçük harf ve bir rakam içermelidir.",
        PASSWORDS_NOT_MATCH: "Şifreler eşleşmiyor.",
        DUPLICATE_EMAIL: "Bu email zaten kullanılıyor.",
        DUPLICATE_PHONE: "Bu telefon numarası zaten kullanılıyor."
    },
    AUTH: {
        INVALID_CREDENTIALS: "Email veya şifre hatalı.",
        UNAUTHORIZED: "Bu işlem için yetkiniz yok.",
        TOKEN_EXPIRED: "Oturum süresi doldu.",
        TOKEN_INVALID: "Geçersiz token.",
        USER_NOT_FOUND: "Kullanıcı bulunamadı.",
        WRONG_PASSWORD: "Şifre yanlış."
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
    }
}; 