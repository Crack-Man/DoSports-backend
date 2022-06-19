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
router.get("/get-foods", controllers.programs.showFoods);

router.post("/add-program-diet", controllers.programs.createProgramDiet);
router.post("/get-program-diet", controllers.programs.showProgramDiet);
router.post("/delete-program-diet", controllers.programs.removeProgramDiet);

router.get("/get-food-categories", controllers.programs.showFoodCategories);
router.post("/add-meal-food", controllers.programs.createMealFood);
router.get("/get-meal-foods/:id", controllers.programs.showMealFoods);
router.post("/delete-meal-food", controllers.programs.removeMealFood);
router.get("/get-food-by-id/:id", controllers.programs.showFoodById);
router.post("/update-amount-food", controllers.programs.changeAmountFood);

router.post("/get-meal-data-by-program-id", controllers.programs.showMealDataByProgramId)

router.post("/add-personal-food", controllers.programs.createPersonalFood);
router.get("/get-personal-foods/:id", controllers.programs.showPersonalFoods);
router.post("/update-personal-food", controllers.programs.changePersonalFood);
router.post("/delete-personal-food", controllers.programs.removePersonalFood);

router.post("/add-ration", controllers.programs.createRation);
router.post("/add-ration-food", controllers.programs.createRationFood);
router.post("/add-ration-to-meal", controllers.programs.createRationToMeal);
router.post("/update-amount-ration-food", controllers.programs.changeAmountRationFood);
router.post("/delete-ration-food", controllers.programs.removeRationFood);
router.get("/get-users-rations/:id", controllers.programs.showUsersRations);
router.get("/get-ration-foods/:id", controllers.programs.showRationFoods);
router.post("/delete-ration", controllers.programs.removeRation);

router.post("/add-dish", controllers.programs.createDish);
router.post("/add-dish-food", controllers.programs.createDishFood);
router.post("/delete-dish", controllers.programs.removeDish);
router.get("/get-users-dishes/:id", controllers.programs.showDishes);
router.get("/get-dish-foods/:id", controllers.programs.showDishFoods);
router.post("/update-amount-dish-food", controllers.programs.changeAmountDishFood);
router.post("/delete-dish-food", controllers.programs.removeDishFood);
router.post("/add-meal-dish", controllers.programs.createMealDish);

router.post("/get-train-mods", controllers.programs.showTrainMods);
router.post("/get-trains", controllers.programs.showTrains);
router.post("/add-train-program", controllers.programs.createTrainProgram);
router.post("/get-train-program", controllers.programs.showTrainProgram);
router.post("/delete-train-program", controllers.programs.removeTrainProgram);

module.exports = router;