const db = require("../config/database.js").db;
const transporter = require("../config/transporter.js").transporter;
const author = require("../config/transporter.js").author;
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

const getLogins = (res) => {
    db.query('SELECT login FROM users', (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getEmails = (res) => {
    db.query('SELECT email FROM users', (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const countLogin = (login, res) => {
    db.query(`SELECT COUNT(login) AS count FROM users WHERE login = ?`, [login], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });   
}

const countEmail = (email, res) => {
    db.query(`SELECT COUNT(email) AS count FROM users WHERE email = ?`, [email], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });   
}

const addUser = (newUser, res) => {
    let filePath = `${path}/config/users/${newUser.email}.txt`;
    let fileContent = JSON.stringify(newUser);
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, {name: "Success"});
        }
    });
}

const getActivateCode = (user, res) => {
    let filePath = `${path}/config/users/${user.email}.txt`;
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, JSON.parse(data).code);
        }
    })
}

const activateUser = (user, res) => {
    let filePath = `${path}/config/users/${user.email}.txt`;
    fs.readFile(filePath, "utf8", (err, data) => {
            if(err) {
                res(`Такой код не найден`, null);
            } else {
                newUser = JSON.parse(data);
                if (newUser.code === user.code) {
                    fs.unlink(filePath, (err) => {
                        if(err) {
                            res(textError(err), null);
                        } else {
                            db.query(`INSERT INTO users SET
                                login = ?,
                                password = ?,
                                email = ?,
                                fullname = ?,
                                birthday = ?,
                                gender = ?,
                                id_region = ?`,
                                [newUser.login, newUser.password, newUser.email,
                                newUser.fullname, newUser.birthday, newUser.gender, newUser.id_region], (err, data) => {
                                    if(err) {
                                        res(textError(err), null);
                                    } else {
                                        res(null, "Пользователь успешно подтвержден");
                                    }
                                }
                            );
                        }
                    });
                } else {
                    res(`Такой код не найден`, null);
                }
            }
    });
}

const findUser = (user, res) => {
    db.query(`SELECT id, password FROM users WHERE email = ? OR login = ?`, [user.login, user.login], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getUser = (id, res) => {
    db.query(`SELECT * FROM users WHERE id = ?`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const generateRestoreCode = (len) => {
    let code = "";
    for (let i = 0; i < len; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}

const addRestoreCode = (options, res) => {
    let filePath = `${path}/config/restore_password_codes/${options.email}.txt`;
    fs.writeFile(filePath, options.code, (err) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, {name: "Success"});
        }
    });
}

const getRestoreCode = (email, res) => {
    let filePath = `${path}/config/restore_password_codes/${email}.txt`;
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, {name: "Success", code: data});
        }
    });
}

const sendMail = (options, res) => {
    message = {
        from: author,
        to: options.email,
        subject: options.subject,
        text: options.text,
        html: options.textHTML,
    };
    
    transporter.sendMail(message, (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, {name: "Success"});
        }
    });
}

const findRestoreCode = (user, res) => {
    let filePath = `${path}/config/restore_password_codes/${user.email}.txt`;
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            if (data === user.code.toString()) {
                res(null, true);
            } else {
                res(null, false);
            }
        }
    });
}

const updatePassword = (input, res) => {
    db.query("UPDATE users SET password = ? WHERE email = ?", [input.password, input.email], (err, data) =>{
        if (err) {
            res(textError(err), null);
        } else {
            let filePath = `${path}/config/restore_password_codes/${input.email}.txt`;
            fs.unlink(filePath, (err, data) => {
                if (err) {
                    res(textError(err), null);
                } else {
                    res(null, {name: "Success"})
                }
            })
        }
    })
}

module.exports.getUsers = getUsers;
module.exports.getLogins = getLogins;
module.exports.getEmails = getEmails;
module.exports.countLogin = countLogin;
module.exports.countEmail = countEmail;
module.exports.addUser = addUser;
module.exports.getActivateCode = getActivateCode;
module.exports.activateUser = activateUser;
module.exports.findUser = findUser;
module.exports.getUser = getUser;
module.exports.generateRestoreCode = generateRestoreCode;
module.exports.addRestoreCode = addRestoreCode;
module.exports.getRestoreCode = getRestoreCode;
module.exports.sendMail = sendMail;
module.exports.findRestoreCode = findRestoreCode;
module.exports.updatePassword = updatePassword;