const User = require('../../models/User');
const Log = require('../../models/Log');
const textUtils = require('../../utils/textUtils');
const Address = require('../../models/Address');
const locationMethods = require('../controllers/locationController');
const authService = require('../../services/authService');

exports.addUserAddress = async (req, res) => {
    try {
        const { userId,password, addressName, name, surname, phone, countryCode, city, district, neighborhood, street, apartment, floor, door, postal_code, description } = req.body;
        
        if(!authService.login(userId, password)) {
            return res.status(400).json({ error: "Şifre yanlış." });
        }
        if(!textUtils.isValidName(addressName)) {
            return res.status(400).json({ error: "Adres adı en az 2 karakter olmalıdır." });}
        if(!textUtils.isValidName(name)) {
            return res.status(400).json({ error: "Ad en az 2 karakter olmalıdır." });}
        if(!textUtils.isValidName(surname)) {
            return res.status(400).json({ error: "Soyad en az 2 karakter olmalıdır." });}
        if(!textUtils.isValidPhoneNumber(phone)) {
            return res.status(400).json({ error: "Telefon numarası geçersiz." });}
        if(!textUtils.isValidText(countryCode)) {
            return res.status(400).json({ error: "Ülke geçersiz." });}
        if(!textUtils.isValidText(city)) {
            return res.status(400).json({ error: "Şehir geçersiz." });}
        if(!textUtils.isValidNumber(floor)) {
            return res.status(400).json({ error: "Kat numarası geçersiz." });}
        if(!textUtils.isValidNumber(door)) {
            return res.status(400).json({ error: "Kapı numarası geçersiz." });}
        if(!textUtils.isValidNumber(postal_code)) {
            return res.status(400).json({ error: "Posta kodu geçersiz." });}
        if(!district || district.trim() === "") {
            return res.status(400).json({ error: "İlçe boş olamaz." });}
        if(!neighborhood || neighborhood.trim() === "") {
            return res.status(400).json({ error: "Mahalle boş olamaz." });}
        if(!street || street.trim() === "") {
            return res.status(400).json({ error: "Sokak boş olamaz." });}
        if(!apartment || apartment.trim() === "") {
            return res.status(400).json({ error: "Apartman boş olamaz." });}
        if(!textUtils.isValidText(description) || description.length < 10) {
            return res.status(400).json({ error: "Açıklama en az 10 karakter olmalıdır." });}
        await getCountryCodesMethod();

        if(!countryCode) {
            return res.status(400).json({ error: "Ülke kodu gereklidir." });
        }
        const allCities = await getCitiesMethod(countryCode);

        if(!allCities) {
            return res.status(400).json({ error: "Ülke kodu geçersiz." });
        }
        if(!city) {
            return res.status(400).json({ error: "Şehir adı gereklidir." });
        }
        if(!allCities.some(city => city.name === city)) {
            return res.status(400).json({ error: "Şehir adı geçersiz." });
        }
        const allDistricts = await getDistrictsMethod(countryCode, city);

        if(!allDistricts) {
            return res.status(400).json({ error: "Şehir adı geçersiz." });
        }
        if(!district) {
            return res.status(400).json({ error: "İlçe adı gereklidir." });
        }
        if(!allDistricts.some(district => district.name === district)) {
            return res.status(400).json({ error: "İlçe adı geçersiz." });
        }
        const allNeighborhoods = await getNeighborhoodsMethod(countryCode, city, district);
        if(!allNeighborhoods) {
            return res.status(400).json({ error: "İlçe adı geçersiz." });
        }
        if(!neighborhood) {
            return res.status(400).json({ error: "Mahalle adı gereklidir." });
        }
        if(!allNeighborhoods.some(neighborhood => neighborhood.name === neighborhood)) {
            return res.status(400).json({ error: "Mahalle adı geçersiz." });
        }

        const address = new Address({
            userId: userId,
            addressName: addressName,
            name: name,
            surname: surname,
            phone: phone,
            countryCode: countryCode,
            city: city,
            district: district,
            neighborhood: neighborhood,
            street: street,
            apartment: apartment,
            floor: floor,
            door: door,
            postal_code: postal_code,
            description: description
        });
        await address.save();
        user.address.push(address._id);
        user.defaultAddress = address._id;
        await user.save();
        const log = new Log({ userId: user._id, actionType: 'addAddress' });
        await log.save();
        res.json({ message: "Adres başarıyla eklendi." });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ülke kodlarını getir
async function getCountryCodesMethod() {
    try {
        return await locationMethods.getCountryCodes();
    } catch (error) {
        throw new Error(`Ülke kodları alınamadı: ${error.message}`);
    }
}

// Şehirleri getir
async function getCitiesMethod(countryCode) {
    try {
        if (!countryCode) {
            throw new Error('Ülke kodu gereklidir');
        }
        countryCode = countryCode.toUpperCase();
        return await locationMethods.getCities(countryCode);
    } catch (error) {
        throw new Error(`Şehirler alınamadı: ${error.message}`);
    }
}

// İlçeleri getir
async function getDistrictsMethod(countryCode, city) {
    try {
        if (!countryCode || !city) {
            throw new Error('Ülke kodu ve şehir adı gereklidir');
        }
        countryCode = countryCode.toUpperCase();
        return await locationMethods.getDistricts(countryCode, city);
    } catch (error) {
        throw new Error(`İlçeler alınamadı: ${error.message}`);
    }
}

// Mahalleleri getir
async function getNeighborhoodsMethod(countryCode, city, district) {
    try {
        if (!countryCode || !city || !district) {
            throw new Error('Ülke kodu, şehir adı ve ilçe adı gereklidir');
        }
        countryCode = countryCode.toUpperCase();
        return await locationMethods.getNeighborhoods(countryCode, city, district);
    } catch (error) {
        throw new Error(`Mahalleler alınamadı: ${error.message}`);
    }
}

// Ülkenin tüm ilçelerini getir
async function getAllDistrictsByCountryMethod(countryCode) {
    try {
        if (!countryCode) {
            throw new Error('Ülke kodu gereklidir');
        }
        countryCode = countryCode.toUpperCase();
        const allDistricts = await locationMethods.getAllDistrictsByCountry(countryCode);
        
        // Daha okunabilir bir format oluştur
        return allDistricts.map(city => ({
            city: city.city,
            districtCount: city.districts.length,
            districts: city.districts.map(d => d.name).sort()
        }));
    } catch (error) {
        throw new Error(`Ülkenin ilçeleri alınamadı: ${error.message}`);
    }
}

exports.getAllUserAddresses = async (req, res) => {
    try {
        const userId = req.body.userId;
        if(!userId){
            return res.status(403).json({ error: "Kullanıcı id gereklidir." });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(403).json({ error: "Kullanıcı bulunamadı." });
        }
        const addresses = await Address.find({ userId: userId });
        const log = new Log({ userId: user._id, actionType: 'getAllUserAddresses' });
        await log.save();
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getUserDefaultAddress = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if(!userId){
            return res.status(403).json({ error: "Kullanıcı id gereklidir." });
        }
        if(!user){
            return res.status(403).json({ error: "Kullanıcı bulunamadı." });
        }
        const address = await Address.findById(user.defaultAddress);
        const log = new Log({ userId: user._id, actionType: 'getUserDefaultAddress' });
        await log.save();
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteUserAddress = async (req, res) => {
    try {
        const {userId, addressId} = req.body;
        const address = await Address.findById({userId: userId, addressId: addressId});
        const user = await User.findById(userId);
        if(!user){
            return res.status(403).json({ error: "Kullanıcı bulunamadı." });
        }
        if(!address) {
            return res.status(404).json({ error: "Adres bulunamadı." });
        }
    
        if(address.userId !== userId) {
            return res.status(403).json({ error: "Bu adresi silemezsiniz." });
        }
        if(address.userId === user.defaultAddress) {
            return res.status(403).json({ error: "Varsayılan adresi silemezsiniz." });
        }
        await address.deleteOne();
        user.address = user.address.filter(id => id.toString() !== addressId);
        if(user.defaultAddress === addressId){
            user.defaultAddress = null;
        }
        await user.save();
        const log = new Log({ userId: user._id, actionType: 'deleteUserAddress' });
        await log.save();
        res.json({ message: "Adres başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.setUserDefaultAddress = async (req, res) => {
    try {
        const {userId, addressId} = req.body;
        if(!userId || !addressId){
            return res.status(403).json({ error: "Kullanıcı id ve adres id gereklidir." });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(403).json({ error: "Kullanıcı bulunamadı." });
        }
        const address = await Address.findById(addressId);
        if(!address){
            return res.status(403).json({ error: "Adres bulunamadı." });
        }
        if(address.userId !== userId){
            return res.status(403).json({ error: "Bu adresi varsayılan adres yapamazsınız." });
        }
        user.defaultAddress = addressId;
        await user.save();
        const log = new Log({ userId: user._id, actionType: 'setUserDefaultAddress' });
        await log.save();
        res.json({ message: "Varsayılan adres başarıyla değiştirildi." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateUserAddress = async (req, res) => {
    try {
        const { userId, password, addressId, addressName, name, surname, phone, countryCode, city, district, neighborhood, street, apartment, floor, door, postal_code, description } = req.body;
        
        // Kullanıcı kontrolü
        if(!authService.login(userId, password)) {
            return res.status(400).json({ error: "Şifre yanlış." });
        }
        const user = await User.findById(userId);

        // Adres kontrolü
        const address = await Address.findById(addressId);
        if(!address) {
            return res.status(404).json({ error: "Adres bulunamadı." });
        }

        // Adresin kullanıcıya ait olup olmadığı kontrolü
        if(address.userId.toString() !== userId) {
            return res.status(403).json({ error: "Bu adresi güncelleme yetkiniz yok." });
        }

        // Tüm adres bilgilerinin aynı olup olmadığını kontrol et
        const isAddressUnchanged = 
            address.addressName === addressName &&
            address.name === name &&
            address.surname === surname &&
            address.phone === phone &&
            address.countryCode === countryCode &&
            address.city === city &&
            address.district === district &&
            address.neighborhood === neighborhood &&
            address.street === street &&
            address.apartment === apartment &&
            address.floor === floor &&
            address.door === door &&
            address.postal_code === postal_code &&
            address.description === description;

        if(isAddressUnchanged) {
            return res.status(400).json({ error: "Adres bilgileri mevcut bilgilerle aynı. Değişiklik yapılmadı." });
        }

        // Validasyonlar
        if(!textUtils.isValidName(addressName)) {
            return res.status(400).json({ error: "Adres adı en az 2 karakter olmalıdır." });
        }
        if(!textUtils.isValidName(name)) {
            return res.status(400).json({ error: "Ad en az 2 karakter olmalıdır." });
        }
        if(!textUtils.isValidName(surname)) {
            return res.status(400).json({ error: "Soyad en az 2 karakter olmalıdır." });
        }
        if(!textUtils.isValidPhoneNumber(phone)) {
            return res.status(400).json({ error: "Telefon numarası geçersiz." });
        }
        if(!textUtils.isValidNumber(floor)) {
            return res.status(400).json({ error: "Kat numarası geçersiz." });
        }
        if(!textUtils.isValidNumber(door)) {
            return res.status(400).json({ error: "Kapı numarası geçersiz." });
        }
        if(!textUtils.isValidNumber(postal_code)) {
            return res.status(400).json({ error: "Posta kodu geçersiz." });
        }
        if(!street || street.trim() === "") {
            return res.status(400).json({ error: "Sokak boş olamaz." });
        }
        if(!apartment || apartment.trim() === "") {
            return res.status(400).json({ error: "Apartman boş olamaz." });
        }
        if(!textUtils.isValidText(description) || description.length < 10) {
            return res.status(400).json({ error: "Açıklama en az 10 karakter olmalıdır." });
        }

        // Lokasyon validasyonları
        await getCountryCodesMethod();

        if(!countryCode) {
            return res.status(400).json({ error: "Ülke kodu gereklidir." });
        }

        const allCities = await getCitiesMethod(countryCode);
        if(!allCities) {
            return res.status(400).json({ error: "Ülke kodu geçersiz." });
        }

        if(!city) {
            return res.status(400).json({ error: "Şehir adı gereklidir." });
        }
        if(!allCities.some(city => city.name === city)) {
            return res.status(400).json({ error: "Şehir adı geçersiz." });
        }

        const allDistricts = await getDistrictsMethod(countryCode, city);
        if(!allDistricts) {
            return res.status(400).json({ error: "Şehir adı geçersiz." });
        }
        if(!district) {
            return res.status(400).json({ error: "İlçe adı gereklidir." });
        }
        if(!allDistricts.some(district => district.name === district)) {
            return res.status(400).json({ error: "İlçe adı geçersiz." });
        }

        const allNeighborhoods = await getNeighborhoodsMethod(countryCode, city, district);
        if(!allNeighborhoods) {
            return res.status(400).json({ error: "İlçe adı geçersiz." });
        }
        if(!neighborhood) {
            return res.status(400).json({ error: "Mahalle adı gereklidir." });
        }
        if(!allNeighborhoods.some(neighborhood => neighborhood.name === neighborhood)) {
            return res.status(400).json({ error: "Mahalle adı geçersiz." });
        }

        // Adresi güncelle
        address.addressName = addressName;
        address.name = name;
        address.surname = surname;
        address.phone = phone;
        address.countryCode = countryCode;
        address.city = city;
        address.district = district;
        address.neighborhood = neighborhood;
        address.street = street;
        address.apartment = apartment;
        address.floor = floor;
        address.door = door;
        address.postal_code = postal_code;
        address.description = description;

        await address.save();

        // Log kaydı
        const log = new Log({ userId: user._id, actionType: 'updateAddress' });
        await log.save();

        res.json({ message: "Adres başarıyla güncellendi.", address });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find();
        const log = new Log({ userId: addresses.userId, actionType: 'getAllAddresses' });
        await log.save();
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAddressById = async (req, res) => {
    try {
        const addressId = req.params.id;
        if(!addressId){
            return res.status(403).json({ error: "Adres id gereklidir." });
        }
        const address = await Address.findById(addressId);
        if(!address){
            return res.status(404).json({ error: "Adres bulunamadı." });
        }
        const log = new Log({ userId: address.userId, actionType: 'getAddress' });
        await log.save();
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        if(!addressId){
            return res.status(403).json({ error: "Adres id gereklidir." });
        }
        const address = await Address.findById(addressId);
        if(!address){
            return res.status(404).json({ error: "Adres bulunamadı." });
        }
        const user = await User.findById(address.userId);
        user.address = user.address.filter(id => id.toString() !== addressId);
        if(user.defaultAddress === addressId){
            user.defaultAddress = null;
        }
        await user.save();
        await address.deleteOne();
        const log = new Log({ userId: user._id, actionType: 'deleteAddress' });
        await log.save();
        res.json({ message: "Adres başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
