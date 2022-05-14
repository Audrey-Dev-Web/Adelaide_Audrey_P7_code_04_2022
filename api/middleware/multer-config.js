const multer = require("multer");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

const storage = multer.diskStorage({
    // fileFilter: (req, file, callback) => {
    //     console.log(req.params.id);

    //     if (req.params.id !== req.auth.userId) {
    //         callback(null, false);
    //     } else {
    //         callback(null, true);
    //     }
    // },

    destination: (req, file, callback) => {
        callback(null, "images");
    },

    // Configuration du nom du fichier
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];

        callback(null, name + Date.now() + "." + extension);
    },
});

module.exports = multer({ storage }).single("image");
