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
    db.query('SELECT * FROM foods WHERE author IS NULL ORDER BY name', (err, data) => {
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
            WHERE date = ? AND id_program = ? ORDER BY dm.id_order ASC`,
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
    db.query(`SELECT mf.id, mf.id_food, mf.id_dish, mf.amount, mf.id_meal,
    f.name, d.name AS name_dish, f.id_food_category, f.proteins, f.fats, f.carbohydrates, f.calories,
    f.fibers, f.glycemic_index, f.author FROM meal_foods AS mf
    LEFT JOIN foods AS f ON mf.id_food = f.id LEFT JOIN dishes AS d ON mf.id_dish = d.id WHERE id_meal = ?`,
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

const getMealDataByProgramId = (id, res) => {
    db.query(`SELECT mf.id, mf.id_food, mf.id_dish, mf.amount, pdm.id_order,
    pdm.time, pd.id_program, pd.date, pd.carbohydrates_degree, pd.meals_number
    FROM meal_foods AS mf INNER JOIN program_diet_meals AS pdm
    ON mf.id_meal = pdm.id INNER JOIN program_diet AS pd
    ON pdm.id_program_diet = pd.id WHERE pd.id_program = ?`,
    [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const addPersonalFood = (food, res) => {
    db.query(`INSERT INTO foods SET name = ?, id_food_category = ?, proteins = ?,
    fats = ?, carbohydrates = ?, calories = ?, fibers = ?, glycemic_index = ?, author = ?`,
    [food.name, food.idCategory, food.proteins, food.fats, food.carbohydrates,
    food.calories, food.fibers, food.glycemicIndex, food.idAuthor], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getPersonalFoods = (id, res) => {
    db.query(`SELECT * FROM foods WHERE author = ?`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const updatePersonalFood = (food, res) => {
    db.query(`UPDATE foods SET name = ?, id_food_category = ?, proteins = ?,
    fats = ?, carbohydrates = ?, calories = ?, fibers = ?, glycemic_index = ? WHERE id = ?`,
    [food.name, food.idCategory, food.proteins, food.fats, food.carbohydrates,
    food.calories, food.fibers, food.glycemicIndex, food.id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const deletePersonalFood = (id, res) => {
    db.query(`DELETE FROM foods WHERE id = ?`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const addRation = (ration, res) => {
    db.beginTransaction((err) => {
        if (err) {
            res(textError(err), null);
        }
        db.query(`INSERT INTO rations SET
        name = ?, id_user = ?`,
        [ration.name, ration.idUser], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    res(textError(err), null);
                });
            } else {
                let insertId = data.insertId;
                for (let i = 0; i < ration.foods.length; i++) {
                    db.query(`INSERT INTO ration_foods SET
                    id_food = ?, id_dish = ?, amount = ?, id_ration = ?`,
                    [ration.foods[i].id_food, ration.foods[i].id_dish, ration.foods[i].amount, insertId], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res(textError(err), null);
                            });
                        }
                        if (i === ration.foods.length - 1) {
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

const addRationFood = (food, res) => {
    db.query(`INSERT INTO ration_foods SET
    id_food = ?, amount = ?, id_ration = ?`,
    [food.idFood, food.amount, food.idRation], (err) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, {name: "Success", text: ""});
        }
    });
}

const addRationToMeal = (ration, res) => {
    db.beginTransaction((err) => {
        if (err) {
            res(textError(err), null);
        }
        for (let i = 0; i < ration.foods.length; i++) {
            db.query(`INSERT INTO meal_foods SET
            id_food = ?, id_dish = ?, amount = ?, id_meal = ?`,
            [ration.foods[i].id_food, ration.foods[i].id_dish, ration.foods[i].amount, ration.idMeal], (err) => {
                if (err) {
                    return db.rollback(() => {
                        res(textError(err), null);
                    });
                }
                if (i === ration.foods.length - 1) {
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
    })
}

const updateAmountRationFood = (food, res) => {
    db.query(`UPDATE ration_foods SET amount = ? WHERE id = ?`, [food.amount, food.id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const deleteRationFood = (id, res) => {
    db.query(`DELETE FROM ration_foods WHERE id = ?`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getUsersRations = (id, res) => {
    db.query(`SELECT * FROM rations WHERE id_user = ?`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getRationFoods = (id, res) => {
    db.query(`SELECT rf.id, rf.id_food, rf.id_dish, rf.amount,
    f.name, d.name AS name_dish, f.id_food_category, f.proteins, f.fats, f.carbohydrates, f.calories,
    f.fibers, f.glycemic_index, f.author FROM ration_foods AS rf LEFT JOIN foods AS f ON rf.id_food = f.id LEFT JOIN dishes AS d ON rf.id_dish = d.id WHERE id_ration = ?`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const deleteRation = (id, res) => {
    db.beginTransaction((err) => {
        if (err) {
            res(textError(err), null);
        }
        db.query(`DELETE FROM ration_foods WHERE id_ration = ?`,
        [id], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    res(textError(err), null);
                });
            } else {
                db.query(`DELETE FROM rations WHERE id = ?`,
                [id], (err) => {
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
}

const addDish = (dish, res) => {
    db.query(`INSERT INTO dishes SET
    name = ?, id_user = ?`,
    [dish.name, dish.idUser], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const addDishFood = (food, res) => {
    db.query(`INSERT INTO dish_foods SET
    id_food = ?, amount = ?, id_dish = ?`,
    [food.idFood, food.amount, food.idDish], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const deleteDish = (id, res) => {
    db.beginTransaction((err) => {
        if (err) {
            res(textError(err), null);
        }
        db.query(`DELETE FROM meal_foods WHERE id_dish = ?`,
        [id], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    res(textError(err), null);
                });
            }
            db.query(`DELETE FROM dish_foods WHERE id_dish = ?`,
            [id], (err, data) => {
                if (err) {
                    return db.rollback(() => {
                        res(textError(err), null);
                    });
                } else {
                    db.query(`DELETE FROM dishes WHERE id = ?`,
                    [id], (err) => {
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
        });
    })
}

const getDishes = (id, res) => {
    db.query(`SELECT * FROM dishes WHERE id_user = ?`,
    [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getDishFoods = (id, res) => {
    db.query(`SELECT df.id, df.id_food, f.name, f.id_food_category, f.proteins, f.fats, f.carbohydrates, f.calories, f.fibers, f.glycemic_index, f.author, df.amount, df.id_dish FROM dish_foods AS df INNER JOIN foods AS f ON df.id_food = f.id WHERE id_dish = ?`,
    [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const updateAmountDishFood = (food, res) => {
    db.query(`UPDATE dish_foods SET amount = ? WHERE id = ?`, [food.amount, food.id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const deleteDishFood = (id, res) => {
    db.query(`DELETE FROM dish_foods WHERE id = ?`, [id], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, {name: "Success", text: ""});
        }
    });
}

const addMealDish = (food, res) => {
    db.query(`INSERT INTO meal_foods SET id_dish = ?, amount = ?, id_meal = ?`,
    [food.idDish, food.amount, food.idMeal], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, {name: "Success", text: ""});
        }
    });
}

const getTrainMods = (program, res) => {
    db.query(`SELECT tm.id, tm.name, tm.period FROM train_mods AS tm INNER JOIN train_conformity AS tc ON tm.id = tc.id_train_mod WHERE tc.aim = ? AND tc.train_prepare = ?`,
    [program.aim, program.trainPrepare], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const getTrains = (program, res) => {
    db.query(`SELECT * FROM train_examples WHERE id_mode IN (SELECT tm.id FROM train_mods AS tm INNER JOIN train_conformity AS tc ON tm.id = tc.id_train_mod WHERE tc.aim = ? AND tc.train_prepare = ?)`,
    [program.aim, program.trainPrepare], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const addTrainProgram = (program, res) => {
    db.beginTransaction((err) => {
        if (err) {
            res(textError(err), null);
        }
        db.query(`INSERT INTO program_train SET
        id_program = ?, date = ?`,
        [program.idProgram, program.date], (err, data) => {
            if (err) {
                return db.rollback(() => {
                    res(textError(err), null);
                });
            }
            db.query(`INSERT INTO program_train_examples SET
            id_program_train = ?, id_train_example = ?`,
            [data.insertId, program.idTrainExample], (err) => {
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
        });
    })
}

const getTrainProgram = (program, res) => {
    db.query(`SELECT pte.id, te.name, te.description, te.count_examples, pt.id_program FROM program_train_examples AS pte
    INNER JOIN train_examples AS te ON pte.id_train_example = te.id
    INNER JOIN program_train AS pt ON pte.id_program_train = pt.id
    WHERE pt.id_program = ? AND date = ?`,
    [program.id, program.date], (err, data) => {
        if (err) {
            res(textError(err), null);
        } else {
            res(null, data);
        }
    });
}

const deleteTrainProgram = (program, res) => {
    db.query(`DELETE pt FROM program_train_examples AS pte
        INNER JOIN program_train AS pt ON pte.id_program_train = pt.id
        WHERE pt.id_program = ? AND pt.date = ?`,
        [program.idProgram, program.date], (err, data) => {
            if (err) {
                res(textError(err), null);
            }
            res(null, {name: "Success", text: data});
    });
}

const getDiaryByDate = (params, res) => {
    db.query(`SELECT * FROM anatomical_diary WHERE id_user = ? AND date = ?`,
        [params.idUser, params.date], (err, data) => {
            if (err) {
                res(textError(err), null);
            }
            res(null, data);
    });
}

const updateDiary = (params, res) => {
    db.query(`UPDATE anatomical_diary SET 
    weight = ?,
    bust = ?,
    bicep = ?,
    hip = ?,
    shin = ?,
    waist = ?,
    neck = ?
    WHERE id_user = ? AND date = ?`,
        [params.weight, params.bust, params.bicep, params.hip, params.shin,
        params.waist, params.neck, params.idUser, params.date], (err, data) => {
            if (err) {
                res(textError(err), null);
            }
            res(null, {name: "Success", text: data});
    });
}

const addDiary = (params, res) => {
    db.query(`INSERT INTO anatomical_diary SET 
    weight = ?,
    bust = ?,
    bicep = ?,
    hip = ?,
    shin = ?,
    waist = ?,
    neck = ?,
    id_user = ?,
    date = ?`,
        [params.weight, params.bust, params.bicep, params.hip, params.shin,
        params.waist, params.neck, params.idUser, params.date], (err, data) => {
            if (err) {
                res(textError(err), null);
            }
            res(null, {name: "Success", text: data});
    });
}

const getUserDiary = (idUser, res) => {
    db.query(`SELECT * FROM anatomical_diary WHERE id_user = ? ORDER BY date`,
        [idUser], (err, data) => {
            if (err) {
                res(textError(err), null);
            }
            res(null, data);
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
module.exports.getMealDataByProgramId = getMealDataByProgramId;
module.exports.addPersonalFood = addPersonalFood;
module.exports.getPersonalFoods = getPersonalFoods;
module.exports.updatePersonalFood = updatePersonalFood;
module.exports.deletePersonalFood = deletePersonalFood;
module.exports.addRation = addRation;
module.exports.addRationFood = addRationFood;
module.exports.addRationToMeal = addRationToMeal;
module.exports.updateAmountRationFood = updateAmountRationFood;
module.exports.deleteRationFood = deleteRationFood;
module.exports.getUsersRations = getUsersRations;
module.exports.getRationFoods = getRationFoods;
module.exports.deleteRation = deleteRation;
module.exports.addDish = addDish;
module.exports.addDishFood = addDishFood;
module.exports.deleteDish = deleteDish;
module.exports.getDishes = getDishes;
module.exports.getDishFoods = getDishFoods;
module.exports.updateAmountDishFood = updateAmountDishFood;
module.exports.deleteDishFood = deleteDishFood;
module.exports.addMealDish = addMealDish;
module.exports.getTrainMods = getTrainMods;
module.exports.getTrains = getTrains;
module.exports.addTrainProgram = addTrainProgram;
module.exports.getTrainProgram = getTrainProgram;
module.exports.deleteTrainProgram = deleteTrainProgram;
module.exports.getDiaryByDate = getDiaryByDate;
module.exports.updateDiary = updateDiary;
module.exports.addDiary = addDiary;
module.exports.getUserDiary = getUserDiary;