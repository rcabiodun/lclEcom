const multer = require("multer")
const path=require('path')
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    console.log("adjabd")
    cb(null,'./uploads');
  },
  filename: function(req, file, cb) {
    console.log("anidhaihn")
    cb(null, `${Date.now()}-${path.extname(file.originalname)}`  );
  }
});
module.exports.productUpload = multer({
  storage: storage
}).single("image");