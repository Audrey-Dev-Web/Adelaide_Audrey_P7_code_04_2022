const express = require("express");
const router = express.Router();

const profileCtrl = require("../controllers/user_profile");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get('/', auth, profileCtrl.getAllProfile);
router.get('/:id', auth, profileCtrl.getOneProfile);
router.put('/:id', auth, multer, profileCtrl.modifyProfile);
router.delete('/:id', auth, profileCtrl.deleteAccount);

module.exports = router;