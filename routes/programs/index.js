const express = require("express");
const controllers = {
    programs: require("../../controllers/controller-programs.js")
}

const router = express.Router();

router.get("/get-lifestyles", controllers.programs.showLifestyles);
router.get("/get-weight-categories", controllers.programs.showWeightCategories);
router.post("/create-program", controllers.programs.createProgram);
router.get("/user-has-active-program/:id", controllers.programs.userHasActiveProgram);
router.post("/deactivate-program", controllers.programs.closeProgram);
router.post("/get-program", controllers.programs.showProgram);

module.exports = router;