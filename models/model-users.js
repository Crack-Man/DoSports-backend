const db = require("../config/database.js").db;
const transporter = require("../config/transporter.js").transporter;
const url = require("../config/path.js").url;
const path = require("../config/path.js").path.backend;
const fs = require("fs");

const textError = (err) => {
    return `Произошла внутренняя ошибка сервера. Пожалуйста, напишите службе поддержки пользователей (support@dosports.ru), укажите обстоятельства возникшей ошибки, а также следующий текст ошибки:\n${err}`
}

const getUsers = (res) => {
    db.query('SELECT * FROM users', (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const countLogin = (login, res) => {
    db.query(`SELECT COUNT(login) AS count FROM users WHERE login = '${login}'`, (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });   
}

const countEmail = (email, res) => {
    db.query(`SELECT COUNT(email) AS count FROM users WHERE email = '${email}'`, (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });   
}

const addUser = (newUser, res) => {
    let filePath = `${path}/config/users/${newUser.code}.txt`;
    let fileContent = JSON.stringify(newUser);
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            res(textError(err), null);
        } else {
            let message = {
                from: 'DoSports <no-reply@dosports.ru>',
                to: newUser.email,
                subject: 'Подтверждение учетной записи DoSports',
                text: `Для активации учетной записи перейдите по ссылке: ${url}/api/users/activate/${newUser.code}`,
                html: `Для активации учетной записи перейдите <a href="${url}/api/users/activate/${newUser.code}">по ссылке</a>`,
            }
            res(null, 'На вашу электронную почту отправлено письмо. Перейдите по ссылке из письма, чтобы активировать учетную запись.\nНе пришло сообщение? Проверьте папку "Спам"');
            transporter.sendMail(message, (err, data) => {
                if (err) {
                    res(textError(err), null);
                }
            });
        }
    });
    
}

const activateUser = (code, res) => {
    let filePath = `${path}/config/users/${code}.txt`;
    fs.readFile(filePath, "utf8", (err, data) => {
            if(err) {
                res(`Такой код не найден`, null);
            } else {
                newUser = JSON.parse(data);
                fs.unlink(filePath, (err) => {
                    if(err) {
                        res(textError(err), null);
                    } else {
                        db.query(`INSERT INTO users SET
                            login = '${newUser.login}',
                            password = '${newUser.password}',
                            email = '${newUser.email}',
                            fullname = '${newUser.fullname}',
                            birthday = '${newUser.birthday}',
                            gender = '${newUser.gender}',
                            id_region = ${newUser.id_region}`, (err, data) => {
                                if(err) {
                                    res(textError(err), null);
                                } else {
                                    res("Пользователь успешно подтвержден");
                                }
                            }
                        );
                    }
                });
                
            }
    });
}

const sendMail = (email, res) => {
    message = {
        from: 'no-reply@dosports.ru',
        to: email,
        subject: 'Проверка письма',
        text: `Сообщение пришло! Ура!`,
        html: `Сообщение пришло! <a href="https://dosports.ru/">Ура!</a>`,
    };
    transporter.sendMail(message, (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, 'На вашу электронную почту отправлено письмо.');
        }
    });
}

module.exports.getUsers = getUsers;
module.exports.countLogin = countLogin;
module.exports.countEmail = countEmail;
module.exports.addUser = addUser;
module.exports.activateUser = activateUser;
module.exports.sendMail = sendMail;