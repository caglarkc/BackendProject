const User = require('../../models/User');
const Log = require('../../models/Log');
const textUtils = require('../../utils/textUtils');
const Address = require('../../models/Address');
const locationMethods = require('../controllers/locationController');
const authService = require('../../services/authService');

exports.addUserAddress = async (req, res) => {
    try {
        const {addressName, name, surname, phone, countryCode, city, district, neighborhood, street, apartment, floor, door, postal_code, description } = req.body;
        
        const user = await authService.login(req.body);
        textUtils.validateAddressName(addressName);
        textUtils.validateName(name);
        textUtils.validateSurname(surname);
        textUtils.validatePhone(phone);
        textUtils.validateText(countryCode);
        textUtils.validateText(city);
        textUtils.validateNumber(floor);
        textUtils.validateNumber(door);
        textUtils.validateNumber(postal_code);
        textUtils.validateInput(district);
        textUtils.validateInput(neighborhood);
        textUtils.validateInput(street);
        textUtils.validateInput(apartment);
        textUtils.validateInput(description);


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
            userId: user._id,
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
        const log = new Log({ objectId: address._id, objectType: 'Address', actionType: 'addAddress', ipAddress: req.ip });
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
        textUtils.validateUserId(userId);
        const user = await User.findById(userId);
        textUtils.validateUser(user);
        const addresses = await Address.find({ userId: userId });
        const log = new Log({ objectId: user._id, objectType: 'User', actionType: 'getAllUserAddresses', ipAddress: req.ip });
        await log.save();
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getUserDefaultAddress = async (req, res) => {
    try {
        const userId = req.body.userId;
        textUtils.validateUserId(userId);
        const user = await User.findById(userId);
        textUtils.validateUser(user);
        const address = await Address.findById(user.defaultAddress);
        const log = new Log({ objectId: user._id, objectType: 'User', actionType: 'getUserDefaultAddress', ipAddress: req.ip });
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
        textUtils.validateUser(user);
        textUtils.validateAddress(address);
    
        if(address.userId !== userId) {
            throw new AuthError(errorMessages.AUTH.UNAUTHORIZED);
        }
        if(address.userId === user.defaultAddress) {
            throw new AuthError(errorMessages.AUTH.UNAUTHORIZED);
        }
        await address.deleteOne();
        user.address = user.address.filter(id => id.toString() !== addressId);
        if(user.defaultAddress === addressId){
            user.defaultAddress = null;
        }
        await user.save();
        const log = new Log({ objectId: address._id, objectType: 'Address', actionType: 'deleteUserAddress', ipAddress: req.ip });
        await log.save();
        res.json({ message: "Adres başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.setUserDefaultAddress = async (req, res) => {
    try {
        const {userId, addressId} = req.body;
        textUtils.validateUserId(userId);
        textUtils.validateAddressId(addressId);

        const user = await User.findById(userId);
        textUtils.validateUser(user);
        const address = await Address.findById(addressId);
        textUtils.validateAddress(address);
        if(address.userId !== userId){
            throw new PermissionError(errorMessages.VALIDATION.INVALID_ADDRESS_ID);
        }
        user.defaultAddress = addressId;
        await user.save();
        const log = new Log({ objectId: address._id, objectType: 'Address', actionType: 'setUserDefaultAddress', ipAddress: req.ip });
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
            throw new AuthError(errorMessages.AUTH.WRONG_PASSWORD);
        }
        const user = await User.findById(userId);

        // Adres kontrolü
        const address = await Address.findById(addressId);
        textUtils.validateAddress(address);

        // Adresin kullanıcıya ait olup olmadığı kontrolü
        if(address.userId.toString() !== userId) {
            throw new PermissionError(errorMessages.PERMISSION.UNAUTHORIZED);
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
            throw new ValidationError(errorMessages.VALIDATION.DUPLICATE_INFOS);
        }

        textUtils.validateAddressName(addressName);
        textUtils.validateName(name);
        textUtils.validateSurname(surname);
        textUtils.validatePhone(phone);
        textUtils.validateNumber(floor);
        textUtils.validateNumber(door);
        textUtils.validateNumber(postal_code);
        textUtils.validateText(street);
        textUtils.validateText(apartment);
        textUtils.validateText(description);

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
        const log = new Log({ objectId: address._id, objectType: 'Address', actionType: 'updateAddress', ipAddress: req.ip });
        await log.save();

        res.json({ message: "Adres başarıyla güncellendi.", address });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find();
        const log = new Log({ objectId: addresses._id, objectType: 'Address', actionType: 'getAllAddresses', ipAddress: req.ip });
        await log.save();
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAddressById = async (req, res) => {
    try {
        const addressId = req.params.id;
        textUtils.validateAddressId(addressId);
        const address = await Address.findById(addressId);
        textUtils.validateAddress(address);
        const log = new Log({ objectId: addressId, objectType: 'Address', actionType: 'getAddress', ipAddress: req.ip });
        await log.save();
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        textUtils.validateAddressId(addressId);
        const address = await Address.findById(addressId);
        textUtils.validateAddress(address);
        const user = await User.findById(address.userId);
        user.address = user.address.filter(id => id.toString() !== addressId);
        if(user.defaultAddress === addressId){
            user.defaultAddress = null;
        }
        await user.save();
        await address.deleteOne();
        const log = new Log({ objectId: addressId, objectType: 'Address', actionType: 'deleteAddress', ipAddress: req.ip });
        await log.save();
        res.json({ message: "Adres başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
