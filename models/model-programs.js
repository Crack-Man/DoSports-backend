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
    weight = ?, id_weight_category = ?, height = ?, train_prepare = ?,
    proteins = ?, fats = ?, carbohydrates = ?,
    calories = ?, fibers = ?, date_start = CURRENT_DATE(), is_active = 1`,
    [program.idUser, program.bmi, program.lifestyle,
    program.weight, program.weightCategory, program.height, parseInt(program.trainPrepare),
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
    db.query(`SELECT * FROM program_base WHERE id_user = ? AND is_active = 1`, [id], (err, data) => {
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