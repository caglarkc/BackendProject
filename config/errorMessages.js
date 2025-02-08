module.exports = {
    VALIDATION: {
        EMPTY_FIELD_WITH_TYPE: "{type} alanı boş bırakılamaz.",



        
        INVALID_CITY: "Geçersiz şehir.",
        INVALID_DISTRICT: "Geçersiz ilçe.",
        INVALID_NEIGHBORHOOD: "Geçersiz mahalle.",
        INVALID_STREET: "Geçersiz sokak.",
        INVALID_APARTMENT: "Geçersiz daire.",
        INVALID_FLOOR: "Geçersiz kat.",
        INVALID_DOOR: "Geçersiz kapı.",
        INVALID_POSTAL_CODE: "Geçersiz posta kodu.",
        INVALID_DESCRIPTION: "Açıklama en fazla 500 karakter olmalıdır.",
        EMPTY_FIELD: "Bu alan boş bırakılamaz.",
        
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
        DUPLICATE_ADDRESS: "Bu adreste zaten kayıtlı.",
        INVALID_LOGIN_DATA: "Lütfen email veya telefon numarasından sadece birini giriniz.",
        MATCH_NOT_FOUND: "Bilgiler eşleşmiyor.",
        EMAIL_NOT_REGISTERED: "Email sistemde kayıtlı değil.",
        PHONE_NOT_REGISTERED: "Telefon numarası sistemde kayıtlı değil.",
        CITY_ERROR: "Şehir bulunamadı.",
        DISTRICT_ERROR: "İlçe bulunamadı.",
        NEIGHBORHOOD_ERROR: "Mahalle bulunamadı.",
        INVALID_INPUT_TYPE: "Geçersiz giriş tipi.",
        CANNOT_DELETE_DEFAULT: "Varsayılan adres silinemez.",
        NO_DEFAULT_ADDRESS: "Varsayılan adres bulunamadı.",
        LOCATION_DATA_REQUIRED: "Lütfen tüm konum verilerini giriniz.",
        NO_CHANGES_MADE: "Değişiklik yapılmamış."
    },

    AUTH: {
        VALIDATION: {
            USER_ID: "Kullanıcı id boş olamaz.",
            PASSWORD: "Şifre boş olamaz.",
            EMAIL: "Email boş olamaz.",
            NAME: "İsim boş olamaz.",
            SURNAME: "Soyisim boş olamaz.",
            PHONE: "Telefon numarası boş olamaz.",

            INVALID_NAME: "İsim en az 2 karakter olmalı ve sadece harf içermelidir.",
            INVALID_SURNAME: "Soyisim en az 2 karakter olmalı ve sadece harf içermelidir.",
            INVALID_PHONE: "Geçersiz telefon numarası. 10 haneli olmalıdır.",
            INVALID_PASSWORD: "Şifre en az 8 karakter olmalı, bir büyük harf, bir küçük harf ve bir rakam içermelidir.",
            INVALID_EMAIL: "Geçersiz email adresi.",
            INVALID_LOGIN_DATA: "Email veya telefon numarası boş olamaz.",
            INVALID_LOGIN_DATA_BOTH: "Email ve telefon numarasından sadece birini giriniz.",

            INVALID_CREDENTIALS: "Email veya şifre hatalı.",
            DUPLICATE_INFOS: "{type} bilgileri aynı.",
            EXISTING_INFOS: "{type} bilgileri sistemde başka bir kullanıcı tarafından kullanılıyor.",
            PASSWORDS_NOT_MATCH: "Şifreler eşleşmiyor.",
        },
        NOT_FOUND: {
            USER: "Kullanıcı bulunamadı.",
        },
        AUTH: {
            TOKEN_EXPIRED: "Oturum süresi doldu.",
            TOKEN_BLACKLISTED: "Bu oturum sonlandırılmış.",
            ALREADY_LOGGED_IN: "Zaten giriş yapılmış durumda.",
            NOT_LOGGED_IN: "Giriş yapılmamış durumda.",
            NO_ACTIVE_SESSION: "Aktif oturum bulunamadı.",
            REFRESH_TOKEN_REQUIRED: "Refresh token gerekli.",
            INVALID_REFRESH_TOKEN: "Geçersiz veya süresi dolmuş refresh token.",

        },
        ADDRESS: {
            COUNTRY_CODE_ERROR: "Ülke kodu hatalı.",
            COUNTRY_CODE_REQUIRED: "Ülke kodu gerekli.",
            CITY_ERROR: "Şehir bulunamadı.",
            CITY_REQUIRED: "Şehir gerekli.",
            DISTRICT_ERROR: "İlçe bulunamadı.",
            DISTRICT_REQUIRED: "İlçe gerekli.",
            NEIGHBORHOOD_ERROR: "Mahalle bulunamadı.",
            NEIGHBORHOOD_REQUIRED: "Mahalle gerekli.",
        },
        
        UNAUTHORIZED: "Bu işlem için yetkiniz yok.",
        
        TOKEN_MISSING: "Token bulunamadı.",
        TOKEN_INVALID: "Geçersiz token.",
        
        USER_NOT_FOUND: "Kullanıcı bulunamadı.",
        WRONG_PASSWORD: "Email veya şifre hatalı.",
        
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
        VALIDATION_ERROR: "Veritabanı doğrulama hatası.",
        TRANSACTION_ERROR: "İşlem hatası."
    },
    PERMISSION: {
        UNAUTHORIZED: "Bu işlem için yetkiniz yok."
    },
    RATE_LIMIT: {
        REMAINING_ATTEMPTS: "Kalan deneme hakkınız: {count}",
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