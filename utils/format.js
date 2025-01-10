const dayjs = require('dayjs');
require('dayjs/locale/fr'); // Load French locale

dayjs.locale('fr');

function formatDate(date) {
    try {
        return dayjs(date, 'YYYY-DD-MM').format('dddd D MMMM YYYY');
    } catch (error) {
        console.log(`Error formatting date: ${date}`, error);
        return 'Invalid Date';
    }
}

module.exports = { formatDate };
