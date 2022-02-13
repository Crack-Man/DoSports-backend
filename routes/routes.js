const express = require("express");
const path = require("../config/path").path.frontend;
const controllers = {
    users: require("../controllers/controller-users.js"),
    regions: require("../controllers/controller-regions.js")
}
 
const router = express.Router();

// Пользователи
router.get("/api/users/get-users", controllers.users.showUsers);
router.get("/api/users/login-is-unique/:login", controllers.users.loginIsUnique);
router.get("/api/users/email-is-unique/:email", controllers.users.emailIsUnique);
router.post("/api/users/add-user", controllers.users.createUser);
router.get("/api/users/activate/:code", controllers.users.confirmUser);
router.get("/api/users/test-mail/:email", controllers.users.testMail);

// Регионы
router.get("/api/regions/get-regions", controllers.regions.showRegions);

// За все остальные ссылки отвечает Vue
router.get('*', (req, res) => {
    res.sendFile(`${path}/index.html`);
});

module.exports = router;