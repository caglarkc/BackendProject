const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};
const isValidPhoneNumber = (num) => {
    return /^[0-9]{10}$/.test(num)
};
const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && email.length >= 10;
};
const isValidNumber = (str) => {
    return /^[0-9]+$/.test(str);
};
const isValidText = (str) => {
    return /^[A-Za-zçÇğĞüÜşŞöÖıİ\s]{3,}$/.test(str);
};

module.exports = {
    isEmpty,
    isValidPhoneNumber,
    isValidEmail,
    isValidNumber,
    isValidText
};