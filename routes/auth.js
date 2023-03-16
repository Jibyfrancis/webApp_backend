const router = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const authModelSchema = require("../model/user")
const secretKey = "mdfj948q34092342084@34"
const verifyToken = require('../verifyTocken')
const multer = require('multer')
const cloudinary = require('cloudinary').v2;
const key=process.env.api_key
const api_key=process.env.api_secret






// multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now());
//   }
// });
// const upload = multer({ storage: storage });

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
      cb(null, true);
  },
});


cloudinary.config({
  cloud_name: "dmxojmunj",
  api_key: key,
  api_secret: api_key
});



router.post('/register', async (req, res) => {

  await bcrypt.hash(req.body.password, 10, (err, hash) => {
    // Store hash in your password DB.
    if (err) {
      res.json({ success: false, message: "hash error" })
    } else {

      const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        mobile: req.body.mobile,
        gender: req.body.gender,
        password: hash,
        status: true

      })
      user.save().then((_) => {

        res.json({ status: 'ok', data: user });
      })
        .catch((err) => {
          res.json({ success: false, message: err })
        })
    }
  });

})
router.post('/login', async (req, res) => {
  console.log("recived call");

  const email = req.body.email;
  const password = req.body.password;

  await authModelSchema.findOne({ email: email }).then(existUser => {
    // console.log(existUser, "user");
    if (existUser && existUser._id) {
      bcrypt.compare(password, existUser.password, (err, response) => {
        if (!err) {
          if (response) {
            const authToken = jwt.sign({ _id: existUser._id, email: existUser.email }, secretKey, {
              expiresIn: '1h'
            })
            res.json({ status: 'ok', data: { authToken, response, existUser } })
          } else if (!response) {
            res.json({ status: 'ok', data: { existUser, response } });
          }
        }
      })
    }else{
      res.json({data:"invalide user Name or password"})
    }
  }).catch(err => {
    res.json({ status: 'error', data: 'Something went wrong' })
  })

})

router.get('/dashboard', verifyToken, async (req, res) => {

  if (req && req.decodeToken) {
    await authModelSchema.findOne({ _id: req.decodeToken._id }).then((user) => {
      console.log(user);
      res.json({ status: 'ok', data: user })
    })
  }
})

// router.post('/image-upload',verifyToken, upload.single('image'), async (req, res) => {
//   // need to add verifytoken later
//   let Img = req.file
//   try {
//     await authModelSchema.updateOne({ _id: req.decodeToken._id }, { $set: { img: Img } }).then((data) => {
//       res.json({ url: result, status: 'ok', message: "the upload of the file was a sucess" });
//     })
//       .catch((err) => {
//         res.json({ status: false, message: "failure occured" });
//       });


//   } catch (err) {
//     console.log("upload error");
//     res.sendStatus(400)
//   }



// });

router.post('/image-upload', upload.single('image'), verifyToken, async (req, res) => {
  console.log("start");
  // console.log(req.file);

  try {
      const path = req.file?.path;
      const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(path, (err, res) => {
              if (err) {
                  console.log(err);
                  return res.status(500).send("upload image error");
              }
              resolve(res.secure_url);
          });
      });

      await authModelSchema.updateOne(
          { _id: req.decodeToken._id },
          {
              $set: {
                  image: result,
              },
          }
      )
          .then((data) => {
              res.json({ url: result, status: 'ok', message: "the upload of the file was a sucess" });
          })
          .catch((err) => {
              res.json({ status: false, message: "failure occured" });
          });

  } catch (err) {
      console.log("start cat");
      console.log(err);
      res.json({ status: false, message: "error occoured", error: err });
  }
})




module.exports = router