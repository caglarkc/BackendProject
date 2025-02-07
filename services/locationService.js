const ValidationError = require('../utils/errors/ValidationError');
const errorMessages = require('../config/errorMessages');
const BaseService = require('./BaseService');

class LocationService extends BaseService {
    
    async getCountryCodes() {
        try {
            // Burada gerçek API çağrısı yapılacak
            return ['TR', 'US', 'GB']; // Örnek veri
        } catch (error) {
            throw new ValidationError(errorMessages.VALIDATION.COUNTRY_CODE_ERROR);
        }
    }

    async getCities(countryCode) {
        try {
            if (!countryCode) {
                throw new ValidationError(errorMessages.VALIDATION.COUNTRY_CODE_REQUIRED);
            }
            
            // Burada gerçek API çağrısı yapılacak
            return [
                { name: 'Istanbul' },
                { name: 'Ankara' },
                { name: 'Izmir' }
            ]; // Örnek veri
        } catch (error) {
            throw new ValidationError(errorMessages.VALIDATION.CITY_ERROR);
        }
    }

    async getDistricts(countryCode, city) {
        try {
            if (!countryCode || !city) {
                throw new ValidationError(errorMessages.VALIDATION.LOCATION_DATA_REQUIRED);
            }
            
            // Burada gerçek API çağrısı yapılacak
            return [
                { name: 'Kadikoy' },
                { name: 'Besiktas' },
                { name: 'Sisli' }
            ]; // Örnek veri
        } catch (error) {
            throw new ValidationError(errorMessages.VALIDATION.DISTRICT_ERROR);
        }
    }

    async getNeighborhoods(countryCode, city, district) {
        try {
            if (!countryCode || !city || !district) {
                throw new ValidationError(errorMessages.VALIDATION.LOCATION_DATA_REQUIRED);
            }
            
            // Burada gerçek API çağrısı yapılacak
            return [
                { name: 'Caferaga' },
                { name: 'Moda' },
                { name: 'Fenerbahce' }
            ]; // Örnek veri
        } catch (error) {
            throw new ValidationError(errorMessages.VALIDATION.NEIGHBORHOOD_ERROR);
        }
    }

    async getAllDistrictsByCountry(countryCode) {
        try {
            if (!countryCode) {
                throw new ValidationError(errorMessages.VALIDATION.COUNTRY_CODE_REQUIRED);
            }
            
            // Burada gerçek API çağrısı yapılacak
            return [
                {
                    city: 'Istanbul',
                    districts: [
                        { name: 'Kadikoy' },
                        { name: 'Besiktas' },
                        { name: 'Sisli' }
                    ]
                }
            ]; // Örnek veri
        } catch (error) {
            throw new ValidationError(errorMessages.VALIDATION.DISTRICT_ERROR);
        }
    }
}

module.exports = new LocationService(); 