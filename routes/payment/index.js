const express = require("express");

const controllers = {
    payment: require("../../controllers/controller-payment.js")
}

const router = express.Router();

router.get("/get-pricelist", controllers.payment.showPricelist);
router.post("/get-pay-link", controllers.payment.showPayLink);
router.post("/add-premium", controllers.payment.setPremium);
router.post("/get-remaining-premium", controllers.payment.showRemainingPremium);
router.post("/user-is-pro", controllers.payment.showUserStatus);

module.exports = router;