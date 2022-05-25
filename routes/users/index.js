const express = require("express");
const controllers = {
    users: require("../../controllers/controller-users.js"),
    regions: require("../../controllers/controller-regions.js"),
    programs: require("../../controllers/controller-programs.js")
}

const router = express.Router();

// Регистрация
router.get("/get-users", controllers.users.showUsers);
router.get("/get-logins", controllers.users.showLogins);
router.get("/get-emails", controllers.users.showEmails);
router.get("/login-is-unique/:login", controllers.users.loginIsUnique);
router.get("/email-is-unique/:email", controllers.users.emailIsUnique);
router.post("/add-user", controllers.users.createUser);
router.post("/activate/resend-code", controllers.users.resendCodeActivate);
router.get("/activate/:user", controllers.users.confirmUser);

router.post("/add-user-mobile", controllers.users.createUserMobile);

// Авторизация
router.post("/auth", controllers.users.auth);

router.post("/verify-token-access", controllers.users.verifyTokenAccess);
router.post("/verify-token-refresh", controllers.users.verifyTokenRefresh);
router.post("/restore-password/send-code", controllers.users.sendCodeRestore);
router.post("/restore-password/resend-code", controllers.users.resendCodeRestore);
router.post("/restore-password/compare-code", controllers.users.compareCodeRestore);


// Изменение данных
router.post("/restore-password/change-password", controllers.users.changePassword);
router.post("/change-personal-data", controllers.users.changePersonalData);
router.post("/change-password", controllers.users.changeProfilePassword);


module.exports = router;