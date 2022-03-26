const jwt = require('jsonwebtoken');
const signature = require('../config/signature.js');

const models = {
    users: require("../models/model-users.js"),
    vk: require("../models/model-vk.js"),
}

const controllers = {
    users: require("./controller-users.js")
}

const showUser = (req, res) => {
    let payload = {
        id: req.user.id,
        displayName: req.user.displayName,
        username: req.user.username,
        gender: req.user.gender,
    };
    if (req.user.emails) payload.email = req.user.emails[0].value;
    let token = jwt.sign(payload, signature, { expiresIn: 600 });
    res.send(
        `<script>
            localStorage.setItem('vk-token', '${token}');
            window.location.replace("/vk-reg");
        </script>`
    );
}

const decodeTokenVk = (req, res) => {
    let token = req.body.value;
    jwt.verify(token, signature, (err, decoded) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", user: decoded});
        }
    })
}

const createUserVk = (req, res) => {
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
                            newUser.gender = newUser.gender[0];
                            let fullname_split = newUser.fullname.split(" ");
                            newUser.fullname = `${fullname_split[1]} ${fullname_split[0]}`;
                            models.vk.addUserVk(newUser, (err, id) => {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.json({name: "Success", text: "", token: controllers.users.generateToken(id)});
                                }
                            })
                        } else {
                            res.send({name: "Error", text: "Пользователь с данным логином уже существует"})
                        }
                    }
                })
            } else {
                res.send({name: "Error", text: "Пользователь с данной электронной почтой уже существует"})
            }
        }
    })
}

const checkUserInDb = (req, res) => {
    let user = req.body;
    models.vk.countIdVk(user.id, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.json({name: "Success", match: !!data[0]["count"], token: controllers.users.generateToken(data[0]["id"])});
        }
    })
}

module.exports.showUser = showUser;
module.exports.decodeTokenVk = decodeTokenVk;
module.exports.createUserVk = createUserVk;
module.exports.checkUserInDb = checkUserInDb;