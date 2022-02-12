const db = require("../config/database.js").db;
const transporter = require("../config/database.js").transporter;
const url = require("../config/path.js").url;
const path = require("../config/path.js").path;
const fs = require("fs");

const textError = (err) => {
    return `Произошла внутренняя ошибка сервера. Пожалуйста, свяжитесь с администратором сайта (dosportsproject@gmail.com) с указанием текста ошибки:\n${err}`
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
    db.query(`SELECT COUNT(login) FROM users WHERE login = '${login}'`, (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });   
}

const countEmail = (email, res) => {
    db.query(`SELECT COUNT(email) FROM users WHERE email = '${email}'`, (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });   
}

const addUser = (newUser, res) => {
    let filePath = `${path}/DoSports-backend/config/users/${newUser.code}.txt`;
    let fileContent = JSON.stringify(newUser);
    fs.open(filePath, 'w', (err) => {
        if (err) {
            res(textError(err), null);
        } else {
            fs.writeFile(filePath, fileContent, (err) => {
                if (err) {
                    res(textError(err), null);
                } else {
                    res(null, 'На вашу электронную почту отправлено письмо. Перейдите по ссылке из письма, чтобы активировать учетную запись.\nНе пришло сообщение? Проверьте папку "Спам"');
                    // transporter.sendMail({
                    //     from: 'DoSports <dosports.master@gmail.com>',
                    //     to: newUser.email,
                    //     subject: 'Подтверждение учетной записи DoSports',
                    //     text: `Для активации учетной записи перейдите по ссылке: ${url}/api/users/activate/${newUser.code}`,
                    //     html: `Для активации учетной записи перейдите <a href="${url}/api/users/activate/${newUser.code}">по ссылке</a>`,
                    // }).then(() => {
                    //     res(null, 'На вашу электронную почту отправлено письмо. Перейдите по ссылке из письма, чтобы активировать учетную запись.\nНе пришло сообщение? Проверьте папку "Спам"');
                    // }).catch((err) => {
                    //     res(textError(err), null);
                    // });
                }
            })
        }
    });
    
}

const activateUser = (code, res) => {
    let filePath = `${path}/DoSports-backend/config/users/${code}.txt`;
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

const sendMail = (message) => {
    let message = {
        from: 'DoSports <dosports.master@gmail.com>',
        to: "toxa19921810@gmail.com",
        subject: 'Подтверждение учетной записи DoSports',
        text: `Для активации учетной записи перейдите по ссылке:`,
        html: `Для активации учетной записи перейдите`,
    }
    transporter.sendMail(message, (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, 'На вашу электронную почту отправлено письмо. Перейдите по ссылке из письма, чтобы активировать учетную запись.\nНе пришло сообщение? Проверьте папку "Спам"');
        }
    });
}

module.exports.getUsers = getUsers;
module.exports.countLogin = countLogin;
module.exports.countEmail = countEmail;
module.exports.addUser = addUser;
module.exports.activateUser = activateUser;