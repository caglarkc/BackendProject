const now = new Date();

module.exports = {
    NOW: now,
    HOUR_AGO: new Date(now - 60 * 60 * 1000),
    DAY_AGO: new Date(now - 24 * 60 * 60 * 1000),
    WEEK_AGO: new Date(now - 7 * 24 * 60 * 60 * 1000)
}; 