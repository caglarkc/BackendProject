const axios = require('axios');
const Geonames = require('geonames.js');

const geonames = new Geonames({
    username: process.env.GEONAMES_USERNAME,
    lan: 'tr',
    encoding: 'JSON'
});

const searchLocations = async (params) => {
    try {
        const response = await geonames.search({
            ...params,
            style: 'FULL',
            username: process.env.GEONAMES_USERNAME
        });

        if (!response.geonames) {
            throw new Error('Veri bulunamadı');
        }

        return response.geonames.map(location => ({
            name: location.name,
            type: location.fcodeName,
            adminCode1: location.adminCode1,
            adminName1: location.adminName1,
            adminCode2: location.adminCode2,
            adminName2: location.adminName2,
            adminCode3: location.adminCode3,
            adminName3: location.adminName3,
            population: location.population,
            latitude: location.lat,
            longitude: location.lng,
            countryCode: location.countryCode,
            countryName: location.countryName,
            featureClass: location.fcl,
            featureCode: location.fcode
        }));
    } catch (error) {
        throw new Error(`Arama hatası: ${error.message}`);
    }
};

const getCountryCodes = async () => {
    try {
        const response = await axios.get('http://api.geonames.org/countryInfoJSON', {
            params: {
                username: process.env.GEONAMES_USERNAME
            }
        });

        if (!response.data?.geonames) {
            throw new Error('Ülke verileri alınamadı');
        }

        return response.data.geonames.map(country => ({
            code: country.countryCode,
            name: country.countryName
        }));
    } catch (error) {
        console.error('Hata:', error.message);
        return [];
    }
};

const getCities = async (countryCode) => {
    try {
        if (!countryCode) {
            throw new Error('Ülke kodu gereklidir');
        }
        
        const cities = await searchLocations({
            country: countryCode,
            featureClass: 'P',
            featureCode: ['PPLA', 'PPLC'],  // PPLA: provincial capital, PPLC: country capital
            maxRows: 1000,
            style: 'FULL'
        });

        // Filter by country code and sort by adminCode1 and name
        return cities
            .filter(city => city.countryCode === countryCode)
            .sort((a, b) => {
                // Önce adminCode1'e göre sırala
                if (a.adminCode1 !== b.adminCode1) {
                    return a.adminCode1.localeCompare(b.adminCode1);
                }
                // Aynı adminCode1'e sahip şehirleri isme göre sırala
                return a.name.localeCompare(b.name);
            });
    } catch (error) {
        throw new Error(`Şehirler alınamadı: ${error.message}`);
    }
};

const getDistricts = async (countryCode, city) => {
    try {
        if (!countryCode || !city) {
            throw new Error('Ülke kodu ve şehir adı gereklidir');
        }

        const districts = await searchLocations({
            country: countryCode,
            adminName1: city,
            featureClass: 'P',
            featureCode: ['PPLA3', 'PPLA4', 'PPL'],
            maxRows: 1000,
            style: 'FULL'
        });

        // Filter districts by country code and city name, then sort by name
        return districts
            .filter(district => 
                district.countryCode === countryCode && 
                district.adminName1 === city
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        throw new Error(`İlçeler alınamadı: ${error.message}`);
    }
};

const getNeighborhoods = async (countryCode, city, district) => {
    try {
        if (!countryCode || !city || !district) {
            throw new Error('Ülke kodu, şehir adı ve ilçe adı gereklidir');
        }

        const neighborhoods = await searchLocations({
            country: countryCode,
            q: district,  // İlçe adını arama terimi olarak kullan
            featureClass: 'P',
            featureCode: ['PPL', 'PPLX', 'PPLA4', 'PPLA5'],  // Mahalle ve yerleşim yeri kodları
            maxRows: 1000,
            style: 'FULL'
        });

        // Sonuçları filtrele
        const filteredNeighborhoods = neighborhoods
            .filter(neighborhood => {
                // Ülke kontrolü
                const isCorrectCountry = neighborhood.countryCode === countryCode;
                // Şehir kontrolü
                const isCorrectCity = neighborhood.adminName1 === city;
                // İlçe kontrolü - adminName2 veya name içinde ilçe adı geçiyor mu
                const isCorrectDistrict = 
                    (neighborhood.adminName2 && neighborhood.adminName2.includes(district)) ||
                    (neighborhood.name && neighborhood.name.includes(district));
                // Geçerli bir ismi var mı
                const hasValidName = neighborhood.name && neighborhood.name.trim() !== '';

                return isCorrectCountry && isCorrectCity && isCorrectDistrict && hasValidName;
            })
            .sort((a, b) => a.name.localeCompare(b.name));

        if (filteredNeighborhoods.length === 0) {
            throw new Error(`${district} ilçesi için mahalle bulunamadı`);
        }

        return filteredNeighborhoods;
    } catch (error) {
        throw new Error(`Mahalleler alınamadı: ${error.message}`);
    }
};

const getAllDistrictsByCountry = async (countryCode) => {
    try {
        if (!countryCode) {
            throw new Error('Ülke kodu gereklidir');
        }

        // Önce ülkenin tüm şehirlerini alalım
        const cities = await getCities(countryCode);
        
        // Her şehir için ilçeleri getirelim
        const allDistricts = await Promise.all(
            cities.map(async (city) => {
                try {
                    const districts = await getDistricts(countryCode, city.name);
                    return {
                        city: city.name,
                        districts: districts.map(d => ({
                            name: d.name,
                            population: d.population,
                            latitude: d.latitude,
                            longitude: d.longitude
                        }))
                    };
                } catch (error) {
                    return {
                        city: city.name,
                        districts: []
                    };
                }
            })
        );

        // Boş ilçesi olan şehirleri filtrele ve alfabetik sırala
        return allDistricts
            .filter(city => city.districts.length > 0)
            .sort((a, b) => a.city.localeCompare(b.city));

    } catch (error) {
        throw new Error(`Ülkenin ilçeleri alınamadı: ${error.message}`);
    }
};

module.exports = {
    getCountryCodes,
    getCities,
    getDistricts,
    getNeighborhoods,
    getAllDistrictsByCountry
};