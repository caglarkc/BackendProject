const User = require('../../models/User');
const Log = require('../../models/Log');
const textUtils = require('../../utils/textUtils');
const Address = require('../../models/Address');
const locationMethods = require('../controllers/locationController');
const addressService = require('../../services/addressService');

exports.addUserAddress = async (req, res, next) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const result = await addressService.addAddress(req.body, ip);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};



exports.getAllUserAddresses = async (req, res, next) => {
    try {
        const addresses = await addressService.getAllAddressesByUserId(req.userId);
        res.status(200).json(addresses);
    } catch (error) {
        next(error);
    }
};

exports.getUserDefaultAddress = async (req, res, next) => {
    try {
        const address = await addressService.getDefaultAddress(req.userId);
        res.status(200).json(address);
    } catch (error) {
        next(error);
    }
};

exports.deleteUserAddress = async (req, res) => {
    try {
        const result = await addressService.deleteAddressByUserId(req.userId, req.params.addressId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.setUserDefaultAddress = async (req, res) => {
    try {
        const result = await addressService.setDefaultAddress(req.userId, req.params.addressId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.updateUserAddress = async (req, res) => {
    try {
        const result = await addressService.updateAddress(req.userId, req.params.addressId, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await addressService.getAllAddresses();
        res.status(200).json(addresses);
    } catch (error) {
        next(error);
    }
}

exports.getAddressById = async (req, res) => {
    try {
        const addressId = req.params.id;
        const address = await addressService.getAddressById(addressId);
        res.status(200).json(address);
    } catch (error) {
        next(error);
    }
}

exports.deleteAddress = async (req, res) => {
    try {
        const addressId = req.body.addressId;
        const result = await addressService.deleteAddress(addressId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

/*
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
*/