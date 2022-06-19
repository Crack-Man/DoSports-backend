const db = require("../config/database.js").db;

const httpBuildQuery = require('http-build-query');
const paykeeper = require("../config/paykeeper.js");
const curl = require('curlrequest');

const textError = (err) => {
    return `Произошла внутренняя ошибка сервера. Пожалуйста, напишите службе поддержки пользователей (support@dosports.ru), укажите обстоятельства возникшей ошибки, а также следующий текст ошибки:\n${err}`
}

const getPricelist = (res) => {
    db.query('SELECT * FROM pricelist', (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getPayLink = (payData, res) => {
    let options = {
        url: paykeeper.server + paykeeper.uriToken,
        include: true,
        headers: paykeeper.header
    };
    
    curl.request(options, (err, result) => {
        if (err) res(textError(err), null);
        let token = JSON.parse(result.split('\r\n').pop()).token;
        
        let pay = {
            pay_amount: payData.cost,
            clientid: payData.user.fullname,
            orderid: payData.days,
            client_email: payData.user.email,
            service_name: "Премиум подписка",
            token: token
        }
        
        let query = httpBuildQuery(pay);
        
        options = {
            url: paykeeper.server + paykeeper.uriPay,
            include: true,
            method: "POST",
            data: query,
            headers: paykeeper.header
        }
        
        curl.request(options, (err, result2) => {
            if (err) res(textError(err), null);
            let invoice = JSON.parse(result2.split('\r\n')[7].split(',"invoice_url"')[0] + "}").invoice_id;
            
            res(null, `https://${paykeeper.server}/bill/${invoice}`);
        });
    });
}

const getUserDataByPayOperation = (payData, res) => {
    db.query(`SELECT pt.id, pt.id_user, pt.days, pt.invoice FROM payment_transactions AS pt INNER JOIN users AS u ON pt.id_user = u.id
    WHERE u.email = ?`, [payData.client_email], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const addPaymentOperation = (operation, res) => {
    db.query(`INSERT INTO payment_history SET
    id_transaction = ?, id_user = ?, sum = ?, days = ?`,
    [operation.idTransaction, operation.idUser, operation.sum, operation.days], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            db.query(`SELECT pro_last_datetime FROM users WHERE id = ?`, [operation.idUser], (err, data) => {
                if (err) {
                    res(textError(err), null);
                } else {
                    if (data.length) {
                        let today = new Date();
                        let dateSql = new Date(data[0].pro_last_datetime);
                        if (data[0].pro_last_datetime === null) {
                            db.query("UPDATE users SET pro_last_datetime = (CAST(? AS DateTime)) + INTERVAL ? DAY WHERE id = ?", [today, operation.days, operation.idUser], (err, data) => {
                                if (err) {
                                    res(textError(err), null);
                                }
                                res(null, data);
                            });
                        } else if (today >= dateSql) {
                            db.query("UPDATE users SET pro_last_datetime = (CAST(? AS DateTime)) + INTERVAL ? DAY WHERE id = ?", [today, operation.days, operation.idUser], (err, data) => {
                                if (err) {
                                    res(textError(err), null);
                                }
                                res(null, data);
                            });
                        } else {
                            db.query("UPDATE users SET pro_last_datetime = pro_last_datetime + INTERVAL ? DAY WHERE id = ?", [operation.days, operation.idUser], (err, data) => {
                                if (err) {
                                    res(textError(err), null);
                                }
                                res(null, data);
                            });
                        }
                    } else {
                        res(null, {name: "Error"});
                    }
                }
            });
        }
    });
}

const getRemainingPremium = (idUser, res) => {
    db.query(`SELECT DATEDIFF((SELECT pro_last_datetime FROM users WHERE id = ?), NOW()) AS diff`, [idUser], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const userIsPro = (idUser, res) => {
    db.query(`SELECT pro_last_datetime > NOW() AS pro FROM users WHERE id = ?`, [idUser], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

module.exports.getPricelist = getPricelist;
module.exports.getPayLink = getPayLink;
module.exports.getUserDataByPayOperation = getUserDataByPayOperation;
module.exports.addPaymentOperation = addPaymentOperation;
module.exports.getRemainingPremium = getRemainingPremium;
module.exports.userIsPro = userIsPro;