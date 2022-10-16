const express = require("express");
const router = new express.Router();
const Register = require("../models/registers");
const Qeries = require("../models/contactus");
const Eximreg = require("../models/eximreg");
const Imgprofile = require("../models/profileimg");
const Importuser = require("../models/import");
const Productlist=require("../models/prolist");

// image uploader start -------
var multer = require("multer");
// image uploader multer
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
// image uploader end -------

router.post("/importclient", async (req, res) => {
  try {
    const impdata = new Importuser(req.body);
    const data = await impdata.save();

    res.status(200).render("marketplace");
    // alert("you have successfully registered for srisriport!!  login to continue");
  } catch (err) {
    res.status(401).send(err);
  }
});


router.post("/eximreg", async (req, res) => {
  try {
    const eximdata = new Eximreg(req.body);
    const data = await eximdata.save();

    res.status(200).render("succes", { role: data.tradeRole });
    // alert("you have successfully registered for srisriport!!  login to continue");
  } catch (err) {
    res.status(401).send(err);
  }
});
router.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const p1 = req.body.psw1;
    const p2 = req.body.psw2;
    if (p1 === p2) {
      const reguser = new Register({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        mobile: req.body.mobile,
        psw1: req.body.psw1,
        psw2: req.body.psw2,
        img: req.file.filename,
      });
      const data = await reguser.save();

      res.status(200).render("profile",{name:reguser.fname,image:reguser.img});
      // alert("you have successfully registered for srisriport!!  login to continue");
    } else {
      res.send("password mismatch");
    }
  } catch (err) {
    res.status(401).send(err);
  }
});
router.post("/eximregister", upload.single("avatar"), async (req, res) => {
  try {
    const p1 = req.body.psw1;
    const p2 = req.body.psw2;
    if (p1 === p2) {
      const reguser = new Register({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        mobile: req.body.mobile,
        psw1: req.body.psw1,
        psw2: req.body.psw2,
        img: req.file.filename,
      });
      const data = await reguser.save();

      res.status(200).render("exim");
      // alert("you have successfully registered for srisriport!!  login to continue");
    } else {
      res.send("password mismatch");
    }
  } catch (err) {
    res.status(401).send(err);
  }
});

router.post("/impregister", async (req, res) => {
  try {
    const p1 = req.body.psw1;
    const p2 = req.body.psw2;
    if (p1 === p2) {
      const reguser = new Register({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        mobile: req.body.mobile,
        psw1: req.body.psw1,
        psw2: req.body.psw2,
      });
      const data = await reguser.save();

      res.status(200).render("importuserdata");
      // alert("you have successfully registered for srisriport!!  login to continue");
    } else {
      res.send("password mismatch");
    }
  } catch (err) {
    res.status(401).send(err);
  }
});
router.post("/contactus", async (req, res) => {
  try {
    const queryofuser = new Qeries(req.body);
    const data = await queryofuser.save();
    res.status(200).redirect("/");
  } catch (err) {
    res.status(401).send(err);
  }
});
router.post("/productlist", (req, res) => {
  res.redirect("/marketplace");
});

// router.get("/login", (req, res) => {
//   res.render("profile");
// });

router.post("/login", async (req, res) => {
  try {
    const p1 = req.body.psw1;
    const email = req.body.email;
    const userData = await Register.findOne({ email: email });
    // const userimgData = await Imgprofile.findOne({ email: email });

    if (p1 === userData.psw1) {
      res.status(200).render("profile", { name: userData.fname ,image:userData.img});
      // res.status(200).render("profile", { name: userData.fname, image: userimgData.img });
      // res.send(userimgData.img);
    } else {
      res.status(400).send("invalid email or password!!");
    }
  } catch (err) {
    res.status(401).send(err);
  }
});

router.post("/clientlogin", async (req, res) => {
  try {
    const p1 = req.body.psw1;
    const email = req.body.email;
    const userData = await Register.findOne({ email: email });
    if (p1 === userData.psw1) {
      res.status(200).render("exim");
    } else {
      res.status(400).send("invalid email or password!!");
    }
  } catch (err) {
    res.status(401).send(err);
  }
});

router.post("/importlogin", async (req, res) => {
  try {
    const p1 = req.body.psw1;
    const email = req.body.email;
    const userData = await Register.findOne({ email: email });
    if (p1 === userData.psw1) {
      res.status(200).render("importuserdata");
    } else {
      res.status(400).send("invalid email or password!!");
    }
  } catch (err) {
    res.status(401).send(err);
  }
});

router.post("/upload", upload.single("avatar"), async (req, res) => {
  try {
    var email = req.body.email;
    var img = req.file.filename;
    const usertextData = await Register.findOne({ email: email });
    const userData = await new Imgprofile({
      email: email,
      img: img,
    });
    const data = userData.save();
    res.render("profile", { image: userData.img, name: usertextData.fname });

    // res.status(200).render("test", { image: userData.email });
  } catch (err) {
    res.status(401).send("upload failed !! try again by filling all details");
  }
});


router.post("/uploadmany", upload.array("myfiles",6), async (req, res) => {
  try {
    var email = req.body.email;
    var imgs = req.files;
    var arr=[];
    imgs.forEach(element => {
      arr.push(element.filename);
      console.log(element.filename);
    });
    console.log(arr);
    
    // const usertextData = await Register.findOne({ email: email });
    const userData = await new Productlist({
      email: email,
      imgs:arr
});
    const data = userData.save();
    res.send(imgs);
  } catch (err) {
    res.status(401).send("upload failed !! try again by filling all details");
  }
});

router.post("/getimg", async (req, res) => {
  try {
    const email = req.body.email;
    // const userData = await Imgprofile.findOne({ email: email });
    const userData = await Productlist.findOne({ email: email });
    // console.log(userData.img);

    // res.status(200).render("test", { image: userData.img });
    res.status(200).render("test", { img1: userData.imgs[0],img2: userData.imgs[1],img3: userData.imgs[2],img4: userData.imgs[3] });
  } catch (err) {
    res.status(401).send(err);
  }
});

module.exports = router;
