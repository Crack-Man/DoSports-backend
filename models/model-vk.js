const db = require("../config/database.js").db;

const textError = (err) => {
    return `Произошла внутренняя ошибка сервера. Пожалуйста, напишите службе поддержки пользователей (support@dosports.ru), укажите обстоятельства возникшей ошибки, а также следующий текст ошибки:\n${err}`
}

const addUserVk = (newUser, res) => {
    db.query(`INSERT INTO users SET
        login = ?,
        password = ?,
        email = ?,
        fullname = ?,
        birthday = ?,
        gender = ?,
        id_region = ?,
        id_vk = ?,
        date_reg = CURRENT_DATE()`,
        [newUser.login, newUser.password, newUser.email,
        newUser.fullname, newUser.birthday, newUser.gender, newUser.id_region, newUser.id_vk], (err, data) => {
            if(err) {
                res(textError(err), null);
            } else {
                res(null, data.insertId);
            }
        }
    );
}

const countIdVk = (id, res) => {
    db.query("SELECT id, COUNT(id) AS count FROM `users` WHERE id_vk = ? AND id_vk <> 0", [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    })
}

module.exports.addUserVk = addUserVk;
module.exports.countIdVk = countIdVk;