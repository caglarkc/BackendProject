// redis in bağlantısını kontrol etmek için
const { redisClient } = require('./config/redis');

async function testRedisFeatures() {
    try {
        console.log('\n=== Redis Özellikleri Testi Başlıyor ===');

        // 1. Temel SET komutları ve süre seçenekleri
        console.log('\n1. SET Komutları:');
        // Normal set
        await redisClient.set('key1', 'deger1');
        // EX ile saniye cinsinden süre
        await redisClient.set('key2', 'deger2', {EX: 60});
        // PX ile milisaniye cinsinden süre
        await redisClient.set('key3', 'deger3', {PX: 60000});
        // NX - key yoksa set et (CREATE)
        await redisClient.set('key4', 'deger4', {NX: true});
        // XX - key varsa set et (UPDATE)
        await redisClient.set('key4', 'yeniDeger4', {XX: true});
        
        // 2. Sayısal İşlemler
        console.log('\n2. Sayısal İşlemler:');
        await redisClient.set('sayac', 1);
        // Artırma
        const yeniDeger1 = await redisClient.incr('sayac');
        console.log('INCR sonrası:', yeniDeger1);
        // Özel miktarda artırma
        const yeniDeger2 = await redisClient.incrBy('sayac', 5);
        console.log('INCRBY 5 sonrası:', yeniDeger2);
        // Azaltma
        const yeniDeger3 = await redisClient.decr('sayac');
        console.log('DECR sonrası:', yeniDeger3);

        // 3. Liste İşlemleri
        console.log('\n3. Liste İşlemleri:');
        // Liste başına ekle
        await redisClient.lPush('liste1', ['item1', 'item2', 'item3']);
        // Liste sonuna ekle
        await redisClient.rPush('liste1', 'item4');
        // Listeyi getir
        const liste = await redisClient.lRange('liste1', 0, -1);
        console.log('Liste elemanları:', liste);
        // Liste başından çıkar
        const ilkEleman = await redisClient.lPop('liste1');
        console.log('Listeden çıkarılan ilk eleman:', ilkEleman);

        // 4. Set İşlemleri
        console.log('\n4. Set İşlemleri:');
        await redisClient.sAdd('set1', ['deger1', 'deger2', 'deger3']);
        // Set elemanlarını getir
        const setElemanlari = await redisClient.sMembers('set1');
        console.log('Set elemanları:', setElemanlari);
        // Eleman kontrolü
        const varMi = await redisClient.sIsMember('set1', 'deger1');
        console.log('deger1 set içinde var mı:', varMi);

        // 5. Hash İşlemleri
        console.log('\n5. Hash İşlemleri:');
        await redisClient.hSet('user:1', {
            'isim': 'Ali',
            'yas': '25',
            'sehir': 'Istanbul'
        });
        // Tek bir alan getir
        const isim = await redisClient.hGet('user:1', 'isim');
        console.log('Kullanıcı ismi:', isim);
        // Tüm alanları getir
        const userBilgileri = await redisClient.hGetAll('user:1');
        console.log('Tüm kullanıcı bilgileri:', userBilgileri);

        // 6. Key İşlemleri
        console.log('\n6. Key İşlemleri:');
        // Pattern ile key arama
        const keys = await redisClient.keys('key*');
        console.log('key ile başlayan keyler:', keys);
        // Key var mı kontrolü
        const keyVarMi = await redisClient.exists('key1');
        console.log('key1 var mı:', keyVarMi);
        // Random key getir
        const randomKey = await redisClient.randomKey();
        console.log('Random key:', randomKey);

        // 7. Transaction Örneği
        console.log('\n7. Transaction Örneği:');
        const multi = redisClient.multi();
        multi.set('transaction1', 'deger1');
        multi.incr('sayac');
        multi.get('transaction1');
        const results = await multi.exec();
        console.log('Transaction sonuçları:', results);

    } catch (error) {
        console.error('Redis test hatası:', error);
    }
}

// Event listeners
redisClient.on('error', (err) => {
    console.error('Redis bağlantı hatası:', err);
});

redisClient.on('connect', () => {
    console.log('Redis bağlantısı başarılı');
    // Bağlantı başarılı olduğunda testleri çalıştır
    testRedisFeatures();
});

redisClient.on('end', () => {
    console.log('Redis bağlantısı kapandı');
});

// 65 saniye sonra tekrar kontrol et
setTimeout(async () => {
    try {
        console.log('\n=== 65 Saniye Sonra Kontrol ===');
        const value = await redisClient.get('isim');
        console.log('isim key\'inin değeri:', value === null ? 'Süre doldu, silindi' : value);
    } catch (error) {
        console.error('Kontrol hatası:', error);
    }
}, 65000);

