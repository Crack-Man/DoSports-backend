const md5 = require('md5');
const crypto = require('crypto');

const paykeeper = require("../config/paykeeper.js");
const yoomoney = require("../config/yoomoney.js");


const models = {
    users: require("../models/model-users.js"),
    payment: require("../models/model-payment.js"),
}

const showPricelist = (req, res) => {
    models.payment.getPricelist((err, results) => {
        if (err) {
            res.send(err);
        }
        res.json(results);
    })
}

const showPayLink = (req, res) => {
    let payData = req.body;
    models.payment.getPayLink(payData, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        }
        res.json({name: "Success", text: "", link: results});
    })
}

const setPremium = (req, res) => {
    let payData = req.body;
    if (payData.key === md5(payData.id + payData.sum + payData.clientid + payData.orderid + paykeeper.secret)) {
        models.users.getUserByEmail(payData.client_email, (err, results) => {
            if (err) {
                res.json({name: "Error", text: err})
            }
            if (results.length) {
                let operation = {
                    idTransaction: payData.id,
                    idUser: results[0].id,
                    sum: payData.sum,
                    days: payData.orderid
                }
                models.payment.addPaymentOperation(operation, (err, results) => {
                    if (err) {
                        res.json({name: "Error", text: err});
                    }
                    let key = md5(payData.id + paykeeper.secret);
                    res.send(`OK ${key}`);
                });
            } else {
                res.json({name: "Error", text: "Wrong POST qery"});
            }
        })
    } else {
        res.json({name: "Error", text: "Wrong POST qery"});
    }
    
}

const setPremiumYooMoney = (req, res) => {
    let payData = req.body;
    let paramsString = `${payData.notification_type}&${payData.operation_id}&${payData.amount}&${payData.currency}&${payData.datetime}&${payData.sender}&${payData.codepro}&${yoomoney.secret}&${payData.label}`;
    let shasum = crypto.createHash('sha1').update(paramsString).digest('hex');
    
    if (payData.sha1_hash === shasum) {
        let label = JSON.parse(payData.label);
        let operation = {
            idTransaction: payData.operation_id,
            idUser: label.idUser,
            sum: label.cost,
            days: label.days
        }
        models.payment.addPaymentOperation(operation, (err, results) => {
            if (err) {
                res.json({name: "Error", text: err});
            }
            res.send(`200 OK`);
        });
    } else {
        res.json({name: "Error", text: "Wrong POST qery"});
    
    
        models.payment.test1(`${shasum} : ${payData.sha1_hash} : ${paramsString}`, (err, results) => {
            res.send(`200 OK`);
        })
    }
}

const showRemainingPremium = (req, res) => {
    let idUser = req.body.id;
    models.payment.getRemainingPremium(idUser, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        }
        res.json({name: "Success", text: "", days: results[0].diff});
    });
}

const showUserStatus = (req, res) => {
    let idUser = req.body.id;
    models.payment.userIsPro(idUser, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        }
        res.json({name: "Success", pro: results[0].pro});
    });
}

module.exports.showPricelist = showPricelist;
module.exports.showPayLink = showPayLink;
module.exports.setPremium = setPremium;
module.exports.setPremiumYooMoney = setPremiumYooMoney;
module.exports.showRemainingPremium = showRemainingPremium;
module.exports.showUserStatus = showUserStatus;