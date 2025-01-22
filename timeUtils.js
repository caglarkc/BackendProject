function returnCurrentDate() {
    const unformattedDate = new Date();

    // Yıl, ay, gün, saat ve dakika bilgilerini al
    const year = unformattedDate.getFullYear();
    const month = String(unformattedDate.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arasında olduğu için +1 ekliyoruz
    const day = String(unformattedDate.getDate()).padStart(2, '0');
    const hours = String(unformattedDate.getHours()).padStart(2, '0');
    const minutes = String(unformattedDate.getMinutes()).padStart(2, '0');
    const seconds = String(unformattedDate.getSeconds()).padStart(2, '0'); // Saniye bilgisi

    const startDate = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;

    return startDate;
}

const getCurrentDate = () => {
    return returnCurrentDate();
}

module.exports = {
    getCurrentDate
}
