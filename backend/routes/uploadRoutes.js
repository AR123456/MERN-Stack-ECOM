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
// function to check file type
//TODO should there also be front end validation to not allow other types of files to be uploaded?
function checkFileType(file, cb) {
  //create expresson with the file types we want - use forward slashes around it
  // jpg or jpeg or png
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // test the file name taken in against the file types
  // creating a variable extname
  // path.extname() is a method on the path object, not same as the const extname
  // This returns true or false
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    // both true so return callback - pass in in null for error and true
    return cb(null, true);
  } else {
    // dont allow this file type
    // here pass just the error into the callback
    cb("Images only!");
  }
}
// passing in as middelware to our route
const upload = multer({
  storage,
  // usemulters fileFilter to validate the type of file is jpg or png
  fileFilter: function (req, file, cb) {
    // this is a custom file checker function from stack overflow -
    // but could have put this all here
    checkFileType(file, cb);
  },
});
// endpoint will be connected to api/upload so just need slash
// pass in the upload middleware, upload a single image but could have been more
// be sure to call it image on front end
router.post("/", upload.single("image"), (req, res) => {
  // all we are going to send back from this route is the path
  res.send(`/${req.file.path}`);
  // on front end set it to be image piece of state and it'll to in the database
});

export default router;
