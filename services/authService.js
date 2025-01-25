const User = require('../models/User');
const Log = require('../models/Log');
const textUtils = require('../utils/textUtils');
const { hashPassword, comparePassword } = require('../utils/hashPassword');

exports.register = async (userData) => {
    const { name, surname, email, phone, password, confirmPassword } = userData;
    
    if(password !== confirmPassword) {
        throw new Error("Şifreler eşleşmiyor.");
    }
    
    if(!textUtils.isValidName(name) || !textUtils.isValidName(surname)) {
        throw new Error("Ad ve soyad en az 2 karakter olmalıdır.");
    }
    
    if(!textUtils.isValidEmail(email)) {
        throw new Error("Email geçersiz.");
    }
    
    if(!textUtils.isValidPhoneNumber(phone)) {
        throw new Error("Telefon numarası geçersiz.");
    }
    
    if(!textUtils.isValidPassword(password)) {
        throw new Error("Şifre en az 8 karakter olmalı, bir büyük harf, bir küçük harf ve bir rakam içermeli.");
    }
    
    if(await User.findOne({ email: email })) {
        throw new Error("Bu email zaten kullanılıyor.");
    }
    
    if(await User.findOne({ phone: phone })) {
        throw new Error("Bu telefon numarası zaten kullanılıyor.");
    }
    
    const user = new User({ 
        name, 
        surname, 
        email, 
        phone, 
        password: await hashPassword(password)
    });
    await user.save();
    
    const log = new Log({ userId: user._id, actionType: 'register' });
    await log.save();
    
    return user;
};

exports.login = async (loginData) => {
    const { data, password } = loginData;
    
    if(!data || !password) {
        throw new Error("Email veya telefon numarası, ve şifre gereklidir.");
    }

    let user;
    if(data.includes('@')) {
        user = await User.findOne({ email: data });
    } else {
        user = await User.findOne({ phone: data });
    }
    
    if(!user) {
        throw new Error("Bu email veya telefon numarası bulunamadı.");
    }
    
    if(!comparePassword(password, user.password)) {
        throw new Error("Şifre yanlış.");
    }
    
    const log = new Log({ userId: user._id, actionType: 'login' });
    await log.save();
    
    return user;
};
