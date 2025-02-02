const now = () => new Date();
const hourAgo = (now) => new Date(now - 60 * 60 * 1000);
const dayAgo = (now) => new Date(now - 24 * 60 * 60 * 1000);
const weekAgo = (now) => new Date(now - 7 * 24 * 60 * 60 * 1000);

module.exports = {
    NOW: now,
    HOUR_AGO: hourAgo,
    DAY_AGO: dayAgo,
    WEEK_AGO: weekAgo
}; 