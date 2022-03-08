const db = require("../config/database.js").db;

const textError = (err) => {
    return `Произошла внутренняя ошибка сервера. Пожалуйста, напишите службе поддержки пользователей (support@dosports.ru), укажите обстоятельства возникшей ошибки, а также следующий текст ошибки:\n${err}`
}

const getLifestyles = (res) => {
    db.query('SELECT * FROM lifestyles', (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getWeightCategories = (res) => {
    db.query('SELECT * FROM weight_categories', (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

module.exports.getLifestyles = getLifestyles;
module.exports.getWeightCategories = getWeightCategories;