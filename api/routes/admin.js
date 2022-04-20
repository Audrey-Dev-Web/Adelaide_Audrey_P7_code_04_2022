const express = require("express");
const router = express.Router();

const adminCtrl = require("../controllers/admin");

router.post('/create', adminCtrl.signup);

module.exports = router;