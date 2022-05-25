const db = require("../config/database.js").db;

const textError = (err) => {
    return `Произошла внутренняя ошибка сервера. Пожалуйста, напишите службе поддержки пользователей (support@dosports.ru), укажите обстоятельства возникшей ошибки, а также следующий текст ошибки:\n${err}`
}

const getLifestyles = (res) => {
    db.query('SELECT * FROM lifestyles', (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getWeightCategories = (res) => {
    db.query('SELECT * FROM weight_categories', (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const addProgram = (program, res) => {
    db.query(`INSERT INTO program_base SET
    id_user = ?, bmi = ?, id_lifestyle = ?,
    weight = ?, id_weight_category = ?, height = ?, aim = ?, train_prepare = ?,
    proteins = ?, fats = ?, carbohydrates = ?,
    calories = ?, fibers = ?, date_start = CURRENT_DATE(), is_active = 1`,
    [program.idUser, program.bmi, program.lifestyle,
    program.weight, program.weightCategory, program.height, parseInt(program.aim), parseInt(program.trainPrepare),
    program.norm.proteins, program.norm.fats, program.norm.carbohydrates,
    program.norm.calories, program.norm.fibers], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const countActiveProgramById = (id, res) => {
    db.query(`SELECT COUNT(is_active) AS count FROM program_base WHERE id_user = ? AND is_active = 1`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });   
}

const deactivateProgram = (id, res) => {
    db.query(`UPDATE program_base SET is_active = 0 WHERE id_user = ?`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });   
}

const getProgramById = (id, res) => {
    db.query(`SELECT program_base.id, program_base.id_user, program_base.bmi, program_base.id_lifestyle, lifestyles.name AS name_lifestyle, program_base.weight, program_base.id_weight_category, program_base.height, program_base.aim, program_base.train_prepare, program_base.proteins, program_base.fats, program_base.carbohydrates, program_base.calories, program_base.fibers, program_base.date_start, program_base.is_active FROM program_base INNER JOIN lifestyles ON program_base.id_lifestyle = lifestyles.id WHERE id_user = ? AND is_active = 1`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getFoods = (res) => {
    db.query('SELECT * FROM foods ORDER BY name', (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getFoodCategories = (res) => {
    db.query('SELECT * FROM food_categories', (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const addProgramDiet = (program, res) => {
    db.beginTransaction((err) => {
        if (err) {
            res(textError(err), null);
        }
        db.query(`INSERT INTO program_diet SET
        id_program = ?, date = ?, carbohydrates_degree = ?, meals_number = ?`,
        [program.idProgram, program.date, program.carbohydratesDegree, program.mealsNumber], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    res(textError(err), null);
                });
            } else {
                let insertId = data.insertId;
                for (let i = 0; i < program.mealsNumber; i++) {
                    db.query(`INSERT INTO program_diet_meals SET
                    id_program_diet = ?, id_order = ?, time = ?`,
                    [insertId, program.mealSchedule[i].idOrder, program.mealSchedule[i].time], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res(textError(err), null);
                            });
                        }
                        if (i === program.mealsNumber - 1) {
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        res(textError(err), null);
                                    });
                                }
                                res(null, {name: "Success", text: ""});
                            })
                        }
                    });
                }
                
            }
        });
    })
}

const getProgramDiet = (input, res) => {
    db.query(`SELECT dm.id, dm.id_program_diet, dm.id_order, dm.time FROM program_diet_meals AS dm INNER JOIN program_diet AS d ON dm.id_program_diet = d.id
            WHERE date = Cast(? as date) AND id_program = ? ORDER BY dm.id_order ASC`,
            [input.date, input.idProgram], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const deleteProgramDiet = (id, res) => {
    db.beginTransaction((err) => {
        if (err) {
            res(textError(err), null);
        }
        db.query(`DELETE FROM meal_foods WHERE id_meal IN
        (SELECT id FROM program_diet_meals WHERE id_program_diet = ?)`, [id], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    res(textError(err), null);
                });
            }
            db.query(`DELETE FROM program_diet_meals WHERE id_program_diet = ?`, [id], (err, data) => {
                if (err) {
                    return db.rollback(() => {
                        res(textError(err), null);
                    });
                } else {
                    db.query(`DELETE FROM program_diet WHERE id = ?`, [id], (err, data) => {
                        if (err) {
                            return db.rollback(() => {
                                res(textError(err), null);
                            });
                        }
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res(textError(err), null);
                                });
                            }
                            res(null, {name: "Success", text: ""});
                        })
                    });
                }
            });
        })
    })
}

const addMealFood = (food, res) => {
    db.query(`INSERT INTO meal_foods SET id_food = ?, amount = ?, id_meal = ?`,
    [food.idFood, food.amount, food.idMeal], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getMealFoods = (id, res) => {
    db.query(`SELECT mf.id, mf.id_food, mf.amount, mf.id_meal,
    f.name, f.id_food_category, f.proteins, f.fats, f.carbohydrates, f.calories,
    f.fibers, f.glycemic_index, f.author FROM meal_foods AS mf
    INNER JOIN foods AS f ON mf.id_food = f.id WHERE id_meal = ?`,
    [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const deleteMealFood = (id, res) => {
    db.query(`DELETE FROM meal_foods WHERE id = ?`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getFoodById = (id, res) => {
    db.query(`SELECT * FROM foods WHERE id = ?`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const updateAmountFood = (food, res) => {
    db.query(`UPDATE meal_foods SET amount = ? WHERE id = ?`, [food.amount, food.id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

module.exports.getLifestyles = getLifestyles;
module.exports.getWeightCategories = getWeightCategories;
module.exports.addProgram = addProgram;
module.exports.countActiveProgramById = countActiveProgramById;
module.exports.deactivateProgram = deactivateProgram;
module.exports.getProgramById = getProgramById;
module.exports.getFoods = getFoods;
module.exports.getFoodCategories = getFoodCategories;
module.exports.addProgramDiet = addProgramDiet;
module.exports.getProgramDiet = getProgramDiet;
module.exports.deleteProgramDiet = deleteProgramDiet;
module.exports.addMealFood = addMealFood;
module.exports.getMealFoods = getMealFoods;
module.exports.deleteMealFood = deleteMealFood;
module.exports.getFoodById = getFoodById;
module.exports.updateAmountFood = updateAmountFood;