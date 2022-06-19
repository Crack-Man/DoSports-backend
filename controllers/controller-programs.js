const models = {
    programs: require("../models/model-programs.js"),
}

const showLifestyles = (req, res) => {
    models.programs.getLifestyles((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    })
}

const showWeightCategories = (req, res) => {
    models.programs.getWeightCategories((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    })
}

const createProgram = (req, res) => {
    let program = req.body;
    models.programs.addProgram(program, (err, data) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const userHasActiveProgram = (req, res) => {
    let id = req.params.id;
    models.programs.countActiveProgramById(id, (err, data) => {
        if (err) {
            res.send({name: "Error", text: err});
        } else {
            res.send({name: "Success", text: !!data[0]["count"]});
        }
    })
}

const closeProgram = (req, res) => {
    let id = req.body.id;
    models.programs.deactivateProgram(id, (err, data) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const showProgram = (req, res) => {
    let id = req.body.id;
    models.programs.getProgramById(id, (err, data) => {
        if (err) {
            res.send({name: "Error", text: err});
        } else {
            res.send({name: "Success", program: data[0]});
        }
    })
}

const showFoods = (req, res) => {
    models.programs.getFoods((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    })
}

const showFoodCategories = (req, res) => {
    models.programs.getFoodCategories((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    })
}

const createProgramDiet = (req, res) => {
    let program = req.body;
    models.programs.addProgramDiet(program, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const showProgramDiet = (req, res) => {
    let input = req.body;
    models.programs.getProgramDiet(input, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const removeProgramDiet = (req, res) => {
    let id = req.body.id;
    models.programs.deleteProgramDiet(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const createMealFood = (req, res) => {
    let food = req.body;
    models.programs.addMealFood(food, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const showMealFoods = (req, res) => {
    let id = req.params.id;
    models.programs.getMealFoods(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const removeMealFood = (req, res) => {
    let id = req.body.id;
    models.programs.deleteMealFood(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const showFoodById = (req, res) => {
    let id = req.params.id;
    models.programs.getFoodById(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", food: results});
        }
    })
}

const changeAmountFood = (req, res) => {
    let food = req.body;
    models.programs.updateAmountFood(food, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const showMealDataByProgramId = (req, res) => {
    let id = req.body.id;
    models.programs.getMealDataByProgramId(food, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: "", foods: results});
        }
    })
}

const createPersonalFood = (req, res) => {
    let food = req.body;
    models.programs.addPersonalFood(food, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const showPersonalFoods = (req, res) => {
    let id = req.params.id;
    models.programs.getPersonalFoods(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const changePersonalFood = (req, res) => {
    let food = req.body;
    models.programs.updatePersonalFood(food, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const removePersonalFood = (req, res) => {
    let id = req.body.id;
    models.programs.deletePersonalFood(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const createRation = (req, res) => {
    let ration = req.body;
    models.programs.addRation(ration, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const createRationFood = (req, res) => {
    let food = req.body;
    models.programs.addRationFood(food, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const createRationToMeal = (req, res) => {
    let ration = req.body;
    models.programs.addRationToMeal(ration, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const changeAmountRationFood = (req, res) => {
    let food = req.body;
    models.programs.updateAmountRationFood(food, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const removeRationFood = (req, res) => {
    let id = req.body.id;
    models.programs.deleteRationFood(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const showUsersRations = (req, res) => {
    let id = req.params.id;
    models.programs.getUsersRations(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const showRationFoods = (req, res) => {
    let id = req.params.id;
    models.programs.getRationFoods(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const removeRation = (req, res) => {
    let id = req.body.id;
    models.programs.deleteRation(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const createDish = (req, res) => {
    let dish = req.body;
    models.programs.addDish(dish, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: "", id: results.insertId});
        }
    })
}

const removeDish = (req, res) => {
    let id = req.body.id;
    models.programs.deleteDish(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const createDishFood = (req, res) => {
    let food = req.body;
    models.programs.addDishFood(food, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const showDishes = (req, res) => {
    let id = req.params.id;
    models.programs.getDishes(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: "", dishes: results});
        }
    })
}

const showDishFoods = (req, res) => {
    let id = req.params.id;
    models.programs.getDishFoods(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: "", foods: results});
        }
    })
}

const changeAmountDishFood = (req, res) => {
    let food = req.body;
    models.programs.updateAmountDishFood(food, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: ""});
        }
    })
}

const removeDishFood = (req, res) => {
    let id = req.body.id;
    models.programs.deleteDishFood(id, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const createMealDish = (req, res) => {
    let dish = req.body;
    models.programs.addMealDish(dish, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const showTrainMods = (req, res) => {
    let program = req.body;
    models.programs.getTrainMods(program, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: "", mods: results});
        }
    })
}

const showTrains = (req, res) => {
    let program = req.body;
    models.programs.getTrains(program, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: "", trains: results});
        }
    })
}

const createTrainProgram = (req, res) => {
    let program = req.body;
    models.programs.addTrainProgram(program, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

const showTrainProgram = (req, res) => {
    let program = req.body;
    models.programs.getTrainProgram(program, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json({name: "Success", text: "", trains: results});
        }
    })
}

const removeTrainProgram = (req, res) => {
    let program = req.body;
    models.programs.deleteTrainProgram(program, (err, results) => {
        if (err) {
            res.json({name: "Error", text: err});
        } else {
            res.json(results);
        }
    })
}

module.exports.showLifestyles = showLifestyles;
module.exports.showWeightCategories = showWeightCategories;
module.exports.createProgram = createProgram;
module.exports.userHasActiveProgram = userHasActiveProgram;
module.exports.closeProgram = closeProgram;
module.exports.showProgram = showProgram;
module.exports.showFoods = showFoods;
module.exports.createProgramDiet = createProgramDiet;
module.exports.showProgramDiet = showProgramDiet;
module.exports.showFoodCategories = showFoodCategories;
module.exports.removeProgramDiet = removeProgramDiet;
module.exports.createMealFood = createMealFood;
module.exports.showMealFoods = showMealFoods;
module.exports.removeMealFood = removeMealFood;
module.exports.showFoodById = showFoodById;
module.exports.changeAmountFood = changeAmountFood;
module.exports.showMealDataByProgramId = showMealDataByProgramId;
module.exports.createPersonalFood = createPersonalFood;
module.exports.showPersonalFoods = showPersonalFoods;
module.exports.changePersonalFood = changePersonalFood;
module.exports.removePersonalFood = removePersonalFood;
module.exports.createRation = createRation;
module.exports.createRationFood = createRationFood;
module.exports.createRationToMeal = createRationToMeal;
module.exports.changeAmountRationFood = changeAmountRationFood;
module.exports.removeRationFood = removeRationFood;
module.exports.showUsersRations = showUsersRations;
module.exports.showRationFoods = showRationFoods;
module.exports.removeRation = removeRation;
module.exports.createDish = createDish;
module.exports.createDishFood = createDishFood;
module.exports.removeDish = removeDish;
module.exports.showDishes = showDishes;
module.exports.showDishFoods = showDishFoods;
module.exports.changeAmountDishFood = changeAmountDishFood;
module.exports.removeDishFood = removeDishFood;
module.exports.createMealDish = createMealDish;
module.exports.showTrainMods = showTrainMods;
module.exports.showTrains = showTrains;
module.exports.createTrainProgram = createTrainProgram;
module.exports.showTrainProgram = showTrainProgram;
module.exports.removeTrainProgram = removeTrainProgram;