const Address = require('../models/Address');
const User = require('../models/User');
const ValidationError = require('../utils/errors/ValidationError');
const AuthError = require('../utils/errors/AuthError');
const textUtils = require('../utils/textUtils');
const errorMessages = require('../config/errorMessages');
const { createLog } = require('./LogService');
const BaseService = require('./BaseService');

// Adres yanıtını formatlama yardımcı metodu
const _formatAddressResponse = (address) => {
    return {
        id: address._id,
        addressName: address.addressName,
        name: address.name,
        surname: address.surname,
        phone: address.phone,
        countryCode: address.countryCode,
        city: address.city,
        district: address.district,
        neighborhood: address.neighborhood,
        street: address.street,
        apartment: address.apartment,
        floor: address.floor,
        door: address.door,
        postal_code: address.postal_code,
        description: address.description,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt
    };
};

class AddressService extends BaseService {

    async validateLocationData(countryCode, city, district, neighborhood) {
        // Ülke kodu kontrolü
        if (!countryCode) {
            throw new ValidationError(
                errorMessages.VALIDATION.COUNTRY_CODE_REQUIRED
            );
        }

        // Şehirleri al
        const allCities = await locationService.getCities(countryCode);
        if (!allCities) {
            throw new ValidationError(
                errorMessages.VALIDATION.CITY_ERROR
            );
        }

        // Şehir kontrolü
        if (!allCities.some(c => c.name === city)) {
            throw new ValidationError(
                errorMessages.VALIDATION.INVALID_CITY,
                {
                    availableCities: allCities.map(c => c.name),
                    message: `Lütfen aşağıdaki şehirlerden birini seçin: ${allCities.map(c => c.name).join(', ')}`
                }
            );
        }

        // İlçeleri al
        const allDistricts = await locationService.getDistricts(countryCode, city);
        if (!allDistricts) {
            throw new ValidationError(
                errorMessages.VALIDATION.DISTRICT_ERROR
            );
        }

        // İlçe kontrolü
        if (!allDistricts.some(d => d.name === district)) {
            throw new ValidationError(
                errorMessages.VALIDATION.INVALID_DISTRICT,
                {
                    availableDistricts: allDistricts.map(d => d.name),
                    message: `Lütfen aşağıdaki ilçelerden birini seçin: ${allDistricts.map(d => d.name).join(', ')}`
                }
            );
        }

        // Mahalleleri al
        const allNeighborhoods = await locationService.getNeighborhoods(countryCode, city, district);
        if (!allNeighborhoods) {
            throw new ValidationError(
                errorMessages.VALIDATION.NEIGHBORHOOD_ERROR
            );
        }

        // Mahalle kontrolü
        if (!allNeighborhoods.some(n => n.name === neighborhood)) {
            throw new ValidationError(
                errorMessages.VALIDATION.INVALID_NEIGHBORHOOD,
                {
                    availableNeighborhoods: allNeighborhoods.map(n => n.name),
                    message: `Lütfen aşağıdaki mahallelerden birini seçin: ${allNeighborhoods.map(n => n.name).join(', ')}`
                }
            );
        }
    }
        
    async addAddress(addressData) {
        // Validasyonlar
        textUtils.validateAddressName(addressData.addressName);
        textUtils.validateName(addressData.name);
        textUtils.validateSurname(addressData.surname);
        textUtils.validatePhone(addressData.phone);
        textUtils.validateInput(addressData.floor, 'Kat');
        textUtils.validateInput(addressData.door, 'Kapı no');
        textUtils.validateInput(addressData.postal_code, 'Posta kodu');
        textUtils.validateInput(addressData.street, 'Sokak');
        textUtils.validateInput(addressData.apartment, 'Bina');
        textUtils.validateInput(addressData.description, 'Açıklama');

        // Lokasyon verilerini doğrula
        await this.validateLocationData(
            addressData.countryCode,
            addressData.city,
            addressData.district,
            addressData.neighborhood
        );

        // Kullanıcıyı kontrol et
        const user = await User.findById(addressData.userId);
        textUtils.validateUser(user);

        const addresses = await Address.find({ userId: addressData.userId });
        // eğer userın adresleri ile aynı namede adres varsa hata ver
        if (addresses.some(address => address.addressName === addressData.addressName)) {
            throw new ValidationError(errorMessages.VALIDATION.DUPLICATE_ADDRESS);
        }

        // Yeni adresi oluştur
        const address = new Address({
            userId: addressData.userId,
            ...addressData
        });
        await address.save();

        // Kullanıcının adres listesini güncelle
        user.addresses.push(address._id);
        
        // İlk adresse varsayılan olarak ayarla
        if (!user.defaultAddress) {
            user.defaultAddress = address._id;
        }
        
        await user.save();

        // Log oluştur
        await createLog(address._id, 'Address', 'ADD_ADDRESS');

        return {
            success: true,
            message: "Adres başarıyla eklendi.",
            address: _formatAddressResponse(address)
        };
    }

    async getAllAddressesByUserId(userId) {
        textUtils.validateUserId(userId);
        const user = await User.findById(userId);
        textUtils.validateUser(user);

        const addresses = await Address.find({ userId });
        textUtils.validateAddress(addresses);

        await createLog(user._id, 'User', 'GET_ALL_ADDRESSES_BY_USER_ID');
        return addresses.map(address => _formatAddressResponse(address));
    }

    async getDefaultAddress(userId) {
        textUtils.validateUserId(userId);
        const user = await User.findById(userId).populate('defaultAddress');
        textUtils.validateUser(user);

        textUtils.validateAddress(user.defaultAddress);

        await createLog(user._id, 'User', 'GET_DEFAULT_ADDRESS');
        return _formatAddressResponse(user.defaultAddress);
    }

    async deleteAddressByUserId(userId, addressId) {
        textUtils.validateUserId(userId);
        textUtils.validateAddressId(addressId);
        const address = await Address.findById(addressId);
        textUtils.validateAddress(address);

        if (address.userId.toString() !== userId) {
            throw new AuthError(errorMessages.PERMISSION.UNAUTHORIZED);
        }

        const user = await User.findById(userId);
        textUtils.validateUser(user);

        // Varsayılan adresi silmeye çalışıyorsa engelle
        if (user.defaultAddress && user.defaultAddress.toString() === addressId) {
            throw new ValidationError(errorMessages.VALIDATION.CANNOT_DELETE_DEFAULT);
        }

        await address.deleteOne();

        // Kullanıcının adres listesini güncelle
        user.addresses = user.addresses.filter(id => id.toString() !== addressId);
        await user.save();

        await createLog(address._id, 'Address', 'DELETE_ADDRESS_BY_USER_ID');

        return {
            success: true,
            message: "Adres başarıyla silindi."
        };
    }

    async setDefaultAddress(userId, addressId) {
        textUtils.validateUserId(userId);
        textUtils.validateAddressId(addressId);
        const user = await User.findById(userId);
        textUtils.validateUser(user);

        const address = await Address.findById(addressId);
        textUtils.validateAddress(address);

        if (address.userId.toString() !== userId) {
            throw new AuthError(errorMessages.PERMISSION.UNAUTHORIZED);
        }

        user.defaultAddress = addressId;
        await user.save();

        await createLog(address._id, 'Address', 'SET_DEFAULT_ADDRESS');

        return {
            success: true,
            message: "Varsayılan adres başarıyla güncellendi.",
            address: _formatAddressResponse(address)
        };
    }

    async updateAddress(userId, addressId, updateData) {
        textUtils.validateUserId(userId);
        textUtils.validateAddressId(addressId);
        const user = await User.findById(userId);
        textUtils.validateUser(user);

        const address = await Address.findById(addressId);
        textUtils.validateAddress(address);
    
        if (address.userId.toString() !== userId) {
            throw new AuthError(errorMessages.PERMISSION.UNAUTHORIZED);
        }
    
        // Güncelleme yapılacak alan var mı kontrol et
        if (Object.keys(updateData).length === 0) {
            throw new ValidationError(errorMessages.VALIDATION.NO_CHANGES_MADE);
        }
    
        // Aynı isimde başka adres var mı kontrol et (kendi adresi hariç)
        if (updateData.addressName) {
            const existingAddress = await Address.findOne({
                userId: userId,
                addressName: updateData.addressName,
                _id: { $ne: addressId } // kendi ID'si hariç
            });
    
            if (existingAddress) {
                throw new ValidationError(errorMessages.VALIDATION.DUPLICATE_ADDRESS);
            }
        }
    
        // Tüm adres bilgileri aynı mı kontrol et
        const isAllSame = !Object.keys(updateData).some(key => 
            updateData[key] !== address[key]
        );
    
        if (isAllSame) {
            throw new ValidationError(errorMessages.VALIDATION.NO_CHANGES_MADE);
        }
    
        // Güncellenecek alanları validate et
        if (updateData.addressName) textUtils.validateAddressName(updateData.addressName);
        if (updateData.name) textUtils.validateName(updateData.name);
        if (updateData.surname) textUtils.validateSurname(updateData.surname);
        if (updateData.phone) textUtils.validatePhone(updateData.phone);
        if (updateData.floor) textUtils.validateInput(updateData.floor, 'Kat');
        if (updateData.door) textUtils.validateInput(updateData.door, 'Kapı no');
        if (updateData.postal_code) textUtils.validateInput(updateData.postal_code, 'Posta kodu');
        if (updateData.street) textUtils.validateInput(updateData.street, 'Sokak');
        if (updateData.apartment) textUtils.validateInput(updateData.apartment, 'Bina');
        if (updateData.description) textUtils.validateInput(updateData.description, 'Açıklama');
    
        // Lokasyon bilgileri güncellendiyse validate et
        if (updateData.countryCode || updateData.city || updateData.district || updateData.neighborhood) {
            // Lokasyon bilgilerinin hepsi girilmiş mi kontrol et
            if (!updateData.countryCode && !updateData.city && !updateData.district && !updateData.neighborhood) {
                throw new ValidationError(errorMessages.VALIDATION.LOCATION_DATA_REQUIRED);
            }
    
            await this.validateLocationData(
                updateData.countryCode || address.countryCode,
                updateData.city || address.city,
                updateData.district || address.district,
                updateData.neighborhood || address.neighborhood
            );
        }
    
        await createLog(address._id, 'Address', 'UPDATE_ADDRESS');

        // Adresi güncelle
        Object.assign(address, updateData);
        await address.save();
    
        return {
            success: true,
            message: "Adres başarıyla güncellendi.",
            address: _formatAddressResponse(address)
        };
    }

    async getAllAddresses() {
        const addresses = await Address.find();
        textUtils.validateAddress(addresses);
        await createLog(addresses._id, 'Address', 'GET_ALL_ADDRESSES');
        return addresses.map(address => _formatAddressResponse(address));
    }

    async getAddressById(addressId) {
        textUtils.validateAddressId(addressId);
        const address = await Address.findById(addressId);
        textUtils.validateAddress(address);
        await createLog(address._id, 'Address', 'GET_ADDRESS_BY_ID');
        return _formatAddressResponse(address);
    }

    async deleteAddress(addressId) {
        textUtils.validateAddressId(addressId);
        const address = await Address.findById(addressId);
        textUtils.validateAddress(address);
        if(address.isDefault) {
            throw new ValidationError(errorMessages.VALIDATION.CANNOT_DELETE_DEFAULT);
        }
        const user = await User.findById(address.userId);
        user.addresses = user.addresses.filter(id => id.toString() !== addressId);
        if(user.defaultAddress === addressId){
            throw new ValidationError(errorMessages.VALIDATION.CANNOT_DELETE_DEFAULT);
        }

        await user.save();

        await address.deleteOne();
        await createLog(address._id, 'Address', 'DELETE_ADDRESS');
        return {
            success: true,
            message: "Adres başarıyla silindi."
        };
    }

}

module.exports = new AddressService(); 