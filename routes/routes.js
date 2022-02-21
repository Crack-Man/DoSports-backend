const express = require("express");
const path = require("../config/path").path.frontend;
const controllers = {
    users: require("../controllers/controller-users.js"),
    regions: require("../controllers/controller-regions.js")
}
 
const router = express.Router();

// Пользователи
router.get("/api/users/get-users", controllers.users.showUsers);
router.get("/api/users/get-logins", controllers.users.showLogins);
router.get("/api/users/get-emails", controllers.users.showEmails);
router.get("/api/users/login-is-unique/:login", controllers.users.loginIsUnique);
router.get("/api/users/email-is-unique/:email", controllers.users.emailIsUnique);
router.post("/api/users/add-user", controllers.users.createUser);
router.get("/api/users/activate/:code", controllers.users.confirmUser);
router.post("/api/users/auth", controllers.users.auth);
router.post("/api/users/verify-token-access", controllers.users.verifyTokenAccess);
router.post("/api/users/verify-token-refresh", controllers.users.verifyTokenRefresh);
router.post("/api/users/restore-password/send-code", controllers.users.sendCodeRestore);
router.post("/api/users/restore-password/resend-code", controllers.users.resendCodeRestore);
router.post("/api/users/restore-password/compare-code", controllers.users.compareCodeRestore);
router.post("/api/users/restore-password/change-password", controllers.users.changePassword);


// Регионы
router.get("/api/regions/get-regions", controllers.regions.showRegions);

// За все остальные ссылки отвечает Vue
router.get('*', (req, res) => {
    res.sendFile(`${path}/index.html`);
});

module.exports = router;