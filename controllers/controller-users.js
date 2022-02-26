const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const signature = require('../config/signature.js');
const url = require("../config/path.js").url;

const models = {
    users: require("../models/model-users.js"),
    sqlInject: require("../models/model-users.js")
}
 
const showUsers = (req, res) => {
    models.users.getUsers((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
}

const showLogins = (req, res) => {
    models.users.getLogins((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
}

const showEmails = (req, res) => {
    models.users.getEmails((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
}

const loginIsUnique = (req, res) => {
    let login = req.params.login;
    models.users.countLogin(login, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(!data[0]["count"]);
        }
    });
}

const emailIsUnique = (req, res) => {
    let email = req.params.email;
    models.users.countEmail(email, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(!data[0]["count"]);
        }
    });
}

const createUser = (req, res) => {
    let newUser = req.body;
    models.users.countEmail(newUser.email, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            if (!data[0]["count"]) {
                models.users.countLogin(newUser.login, (err, data) => {
                    if (err) {
                        res.send(err);
                    } else {
                        if (!data[0]["count"]) {
                            newUser.password = bcrypt.hashSync(newUser.password, 10);
                            newUser.code = bcrypt.hashSync(newUser.email, 10).replaceAll("/", "a");
                            models.users.addUser(newUser, (err, data) => {
                                if (err) {
                                    res.send(err);
                                } else {
                                    let options = {
                                        email: newUser.email,
                                        subject: 'Подтверждение учетной записи DoSports',
                                        text: `Для активации учетной записи перейдите по ссылке: ${url}/api/users/activate/${newUser.email}:${newUser.code}`,
                                        textHTML: `Для активации учетной записи перейдите <a href="${url}/api/users/activate/${newUser.email}:${newUser.code}">по ссылке</a>`,
                                    };
                                    models.users.sendMail(options, (err, data) => {
                                        if (err) {
                                            res.json({name: "Error", text: err});
                                        } else {
                                            res.json({name: "Success", text: `Чтобы завершить регистрацию, перейдите по ссылке из письма, которое мы отправили на ${newUser.email}`})
                                        }
                                    })
                                }
                            })
                        } else {
                            res.send("Пользователь с данным логином уже существует")
                        }
                    }
                })
            } else {
                res.send("Пользователь с данной электронной почтой уже существует")
            }
        }
    })
}

const resendCodeActivate = (req, res) => {
    let user = req.body;
    models.users.getActivateCode(user, (err, code) => {
        if (err) {
            res.send(err);
        } else {
            let options = {
                email: user.email,
                subject: 'Подтверждение учетной записи DoSports',
                text: `Для активации учетной записи перейдите по ссылке: ${url}/api/users/activate/${user.email}:${code}`,
                textHTML: `Для активации учетной записи перейдите <a href="${url}/api/users/activate/${user.email}:${code}">по ссылке</a>`,
            };
            models.users.sendMail(options, (err, data) => {
                if (err) {
                    res.json({name: "Error", text: err});
                } else {
                    res.json({name: "Success", text: `Чтобы завершить регистрацию, перейдите по ссылке из письма, которое мы отправили на ${user.email}`})
                }
            })
        }
    })
}

const confirmUser = (req, res) => {
    let input = req.params.user.split(":");
    let user = {
        email: input[0],
        code: input[1]
    };
    models.users.activateUser(user, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
}

const auth = (req, res) => {
    let user = req.body;
    models.users.findUser(user, (err, data) => {
        if (err) {
            res.send(err);
        } else if (data.length) {
            let userAuth = data[0];
            if (bcrypt.compareSync(user.password, userAuth["password"])) {
                res.json({message: "", token: generateToken(userAuth["id"])});
            } else {
                res.json({message: "Неверный пароль"});
            }
        } else {
            res.json({message: "Пользователь не найден"});
        }
    })
}

const generateToken = (id) => {
    let payload = {
        id: id
    }
    let tokenAccess = jwt.sign(payload, signature, { expiresIn: 1800 });
    let tokenRefresh = jwt.sign(payload, signature, { expiresIn: "30 days" });
    return {access: tokenAccess, refresh: tokenRefresh};
}

const verifyTokenAccess = (req, res) => {
    let token = req.body.access;
    jwt.verify(token, signature, function(err, decoded) {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            id = decoded.id;
            models.users.getUser(id, (err, data) => {
                if (err) {
                    res.json({name: "Error", text: err});
                } else {
                    if (data.length) {
                        let userAuth = data[0];
                        res.json({name: "Success", user: data[0]})
                    } else {
                        res.json({name: "Error", text: "Пользователь не найден"});
                    }
                }
            })
        }
    });
}

const verifyTokenRefresh = (req, res) => {
    let token = req.body.refresh;
    jwt.verify(token, signature, function(err, decoded) {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            id = decoded.id;
            models.users.getUser(id, (err, data) => {
                if (err) {
                    res.json({name: "Error", text: err});
                } else {
                    if (data.length) {
                        let userAuth = data[0];
                        res.json({name: "Success", token: generateToken(id), user: userAuth})
                    } else {
                        res.json({name: "Error", text: "Пользователь не найден"});
                    }
                }
            })
        }
    });
}

const sendCodeRestore = (req, res) => {
    let email = req.body.email;
    models.users.countEmail(email, (err, data) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            if (data[0]["count"]) {
                let code = models.users.generateRestoreCode(5);
                let options = {
                    email: email,
                    code: code
                }
                models.users.addRestoreCode(options, (err, data) => {
                    if (err) {
                        res.send({name: "Error", text: err});
                    } else {
                        options.subject = "Восстановление пароля";
                        options.text = `Код подтверждения: ${code}`;
                        options.textHTML = options.text;
                        models.users.sendMail(options, (err, data) => {
                            if (err) {
                                res.json({name: "Error", text: err});
                            } else {
                                res.json({name: "Success", text: `Введите код, который пришел вам на почту ${options.email}`});
                            }
                        })
                    }
                })
                
            } else {
                res.json({name: "Error", text: "Пользователь не найден"})
            }
        }
    });
}

const resendCodeRestore = (req, res) => {
    let email = req.body.email;
    models.users.getRestoreCode(email, (err, data) => {
        if (err) {
            res.send({name: "Error", text: err});
        } else {
            let options = {
                email: email,
                subject: "Восстановление пароля",
                text: `Код подтверждения: ${data.code}`,
                textHTML: `Код подтверждения: ${data.code}`,
            }
            
            models.users.sendMail(options, (err, data) => {
                if (err) {
                    res.json({name: "Error", text: err});
                } else {
                    res.json({name: "Success", text: `Введите код, который пришел вам на почту ${options.email}`});
                }
            })
        }
    })
}

const compareCodeRestore = (req, res) => {
    let user = req.body;
    models.users.findRestoreCode(user, (err, data) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: "", match: data});
        }
    })
}

const changePassword = (req, res) => {
    let user = req.body;
    models.users.findRestoreCode(user, (err, data) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            if (data) {
                user.password = bcrypt.hashSync(user.password, 10);
                models.users.updatePassword(user, (err, data) => {
                    if (err) {
                        res.json({name: "Error", text: err});
                    } else {
                        res.json({name: "Success", text: "Пароль успешно изменен"})
                    }
                })
            }
        }
    })
}

module.exports.showUsers = showUsers;
module.exports.showLogins = showLogins;
module.exports.showEmails = showEmails;
module.exports.loginIsUnique = loginIsUnique;
module.exports.emailIsUnique = emailIsUnique;
module.exports.createUser = createUser;
module.exports.resendCodeActivate = resendCodeActivate;
module.exports.confirmUser = confirmUser;
module.exports.auth = auth;
module.exports.verifyTokenAccess = verifyTokenAccess;
module.exports.verifyTokenRefresh = verifyTokenRefresh;
module.exports.sendCodeRestore = sendCodeRestore;
module.exports.resendCodeRestore = resendCodeRestore;
module.exports.compareCodeRestore = compareCodeRestore;
module.exports.changePassword = changePassword;