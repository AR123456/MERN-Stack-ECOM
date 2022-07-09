// route for uploading files and the multer config and validation
// bring in path from node
import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();
// multer config - initialize storage engine
const storage = multer.diskStorage({
  //object with 2 functions  destination - get this from docs
  // take in request , file and callback
  destination(req, file, cb) {
    // into call back null because there is no error and upload location
    cb(null, "uploads/");
  },
  // then file name which takes in the same 3 things
  filename(req, file, cb) {
    // again first passed in to callback is null
    // then the file name.  Format file name in case someone uploads duplicate file names
    // have access to fieldname and then add - date
    // to get the extention of jpg or png use nodepath module (import needed)
    // extname method from path takes the extention from the orignal file
    // extname takes care of adding the
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;
