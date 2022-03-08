const express = require("express");
const path = require("../config/path").path.frontend;
const api = {
    users: require("./users/index.js"),
    vkAuth: require("./vk-auth/index.js")
}
const controllers = {
    users: require("../controllers/controller-users.js"),
    regions: require("../controllers/controller-regions.js"),
    programs: require("../controllers/controller-programs.js")
}
const passport = require("passport");
 
const router = express.Router();

// Пользователи
router.use("/api/users", api.users);

// Авторизация VK
router.use("/api/vk-auth", api.vkAuth);

// Регионы
router.get("/api/regions/get-regions", controllers.regions.showRegions);

// Программы
router.get("/api/programs/get-lifestyles", controllers.programs.showLifestyles);
router.get("/api/programs/get-weight-categories", controllers.programs.showWeightCategories);

// За все остальные ссылки отвечает Vue
router.get('*', (req, res) => {
    res.sendFile(`${path}/index.html`);
});

module.exports = router;