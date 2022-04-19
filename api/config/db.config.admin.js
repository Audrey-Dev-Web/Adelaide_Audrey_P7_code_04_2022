require("dotenv").config();

const db_master_acc = process.env.DB_ADMIN_ACC
const db_master_acc_pass = process.env.DB_ADMIN_PASSWORD

const admin_settings = {
    user: db_master_acc,
    password: db_master_acc_pass
};

module.exports = admin_settings;