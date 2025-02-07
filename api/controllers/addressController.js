const AddressService = require('../../services/AddressService');
const BaseController = require('./BaseController');
class AddressController extends BaseController {

    async addUserAddress(req, res, next) {
        try {
            const result = await AddressService.addAddress(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getAllUserAddresses(req, res, next) {
        try {
            const addresses = await AddressService.getAllAddressesByUserId(req.userId);
            res.status(200).json(addresses);
        } catch (error) {
            next(error);
        }
    }

    async getUserDefaultAddress(req, res, next) {
        try {
            const address = await AddressService.getDefaultAddress(req.userId);
            res.status(200).json(address);
        } catch (error) {
            next(error);
        }
    };
    
    async deleteUserAddress(req, res, next) {
        try {
            const result = await AddressService.deleteAddressByUserId(req.userId, req.params.addressId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
    
    async setUserDefaultAddress(req, res, next) {
        try {
            const result = await AddressService.setDefaultAddress(req.userId, req.params.addressId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
    
    async updateUserAddress(req, res, next) {
        try {
            const result = await AddressService.updateAddress(req.userId, req.params.addressId, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
    
    async getAllAddresses(req, res, next) {
        try {
            const addresses = await AddressService.getAllAddresses();
            res.status(200).json(addresses);
        } catch (error) {
            next(error);
        }
    }
    
    async getAddressById(req, res, next) {
        try {
            const addressId = req.params.id;
            const address = await AddressService.getAddressById(addressId);
            res.status(200).json(address);
        } catch (error) {
            next(error);
        }
    }
    
    async deleteAddress(req, res, next) {
        try {
            const addressId = req.body.addressId;
            const result = await AddressService.deleteAddress(addressId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new AddressController();




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