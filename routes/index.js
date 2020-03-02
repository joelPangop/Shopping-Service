const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

require('../models/Articles');
const Article = mongoose.model('Article');

require('../models/User');
const User = mongoose.model('User');

require('../models/UserInfo');
const UserInfo = mongoose.model('UserInfo');

require('../models/Address');
const Address = mongoose.model('Address');

require('../models/Telephone');
const Telephone = mongoose.model('Telephone');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const GridFSBucket = require("multer-gridfs-storage");
const multer = require("multer");
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');

const SECRET_KEY = "secretkey23456";

let fileSaved = [];

function findUserByEmail(email, cb) {
    return User.find().where({'email': email}).exec(cb);
}

router.post('/user', async function (req, res, cb) {
    console.log('body:', req.body);
    const user = new User(req.body);
    user.save().then(() => {
        console.log("User admin is created");
        res.status(200).json({response: "User admin is created", user: user})
    }).catch((err) => {
        if (err) {
            throw err;
        }
    });
});

router.put('/user', async function (req, res, cb) {
    console.log('body:', req.body);
    const user = new User(req.body);
    const usr = await User.findOne({"_id": user.id});

    if (usr) {
        usr.username = user.username;
        usr.email = user.email;
        usr.userInfo = user.userInfo;
        usr.avatar = user.avatar;
        usr.type = user.type;
        usr.contact = user.contact;
        usr.save();
        fileSaved = [];
        res.status(200).json({user: usr, reponse: 'Profile cree'});
    }

});

async function newUser(body, cb) {
    const newUser = new User(body[0]);
    console.log(body);
    const newUserInfo = new UserInfo(body[1]);

    const newAddress = new Address();

    newAddress.roadName = body[1].address.nomRue;
    newAddress.appartNumber = body[1].address.appNum;
    // newUserInfo.address.compte = body.userInfo.compte;
    newAddress.town = body[1].address.ville;
    newAddress.region = body[1].address.region;
    newAddress.country = body[1].address.pays;
    // let newTelephones = [];
    let newTelephones = body[1].telephones;

    console.log("userInfo", newUserInfo);
    console.log("address", newAddress);
    console.log("telephones", newTelephones);

    // body[1] = newUserInfo;
    // body[1].address = newAddress;

    if (!body.role) {
        body.role = "Guest";
    }

    newUser.userInfo = newUserInfo;
    newUser.userInfo.address = newAddress;
    await newAddress.save();

    return await newUser.save().then((err) => {
        cb(err);
        console.log("user", body)
    });

    // res.status(201).sendEmail(body);

    // res.send("A new book created with success");
}

/* GET home page. */
router.get('/', function (req, res, next) {
    // req.body
    res.render('login', {title: 'Express'});
});

router.post('/article', async function (req, res, cb) {
    const art = new Article();
    art.title = req.body.title;
    art.price = req.body.price;
    art.description = req.body.description;
    art.category = req.body.category;
    art.pictures = fileSaved;
    art.averageStar = 1;
    art.state = req.body.state;
    art.city = req.body.city;
    art.availability = req.body.availability;
    art.owner = '';
    art.utilisateurId = '';
    await art.save();
    fileSaved = [];
    res.status(200).send({sucess: true, res: art});

});

router.put('/article/utilisateurId/:userId/articleId/:articleId', async function (req, res, cb) {
    const userId = req.params.userId;
    const articleId = req.params.articleId;
    const art = await Article.findOne({"_id": articleId, "utilisateurId": userId});
    art.averageStar = req.body.averageStar;
    art.save();
    res.status(200).send(art);

    // res.render('index', {title: 'Express'});
});

router.get('/article', async function (req, res, next) {
    const articles = await Article.find({});
    // res.status(200).json(articles);
    console.log('articles', articles);
    res.status(200).send(JSON.stringify(articles));
    // res.render('articles', {articles: articles});
});

router.get('/article/category/:category', async function (req, res, next) {
    const cat = req.params.category;
    const articles = await Article.find({"category": cat});
    // res.status(200).json(articles);
    console.log('articles', articles);
    res.status(200).send(JSON.stringify(articles));
    // res.render('articles', {articles: articles});
});

router.get('/article/:id', async function (req, res, next) {
    const id = req.params.id;
    const article = await Article.findOne({"_id": id});
    // res.status(200).json(articles);
    console.log('articles', article);
    res.status(200).send(article);
    // res.render('articles', {articles: articles});
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    findUserByEmail(email, (err, user) => {
        if (err) return res.status(500).send('Server error!');
        if (!user[0]) return res.status(404).send('User not found!');
        const result = bcrypt.compareSync(password, user[0].password);
        if (!result) return res.status(401).send('Password not valid!');

        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({id: user[0].id}, SECRET_KEY, {
            expiresIn: expiresIn
        });
        console.log("user", user);
        // res.status(200).send({"user": user, "access_token": accessToken, "expires_in": expiresIn});
        res.status(200).json({user: user, access_token: accessToken});
    })
});

router.post('/register', async (req, res) => {
    const name = req.body[0].name;
    const email = req.body[0].email;
    console.log(req.body);
    const password = bcrypt.hashSync(req.body[0].password);

    await newUser(req.body, (err, user) => {
        // if (err) return res.status(500).send("Server error!");
        findUserByEmail(email, (err, user) => {
            if (err) return res.status(500).send('Server error!');
            const expiresIn = 24 * 60 * 60;
            const accessToken = jwt.sign({id: user.id}, SECRET_KEY, {
                expiresIn: expiresIn
            });
            res.status(200).send({
                "user": user, "access_token": accessToken, "expires_in": expiresIn
            });
        });
    });
});

let gfs;

let mongoURI = "mongodb://localhost:27017/ShoppingDB";

let connection = require('../connection/Connection');
connection.connectionDb.then(res => {
    gfs = Grid(res.connections[0].db, mongoose.mongo);
    gfs.collection('uploads');
    // gfs.collection('movies');
});

// Create storage engine
const storage = new GridFSBucket({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
                fileSaved.push(filename);
                console.log('file', fileSaved);
            });
        });
    }
});
const upload = multer({storage});

// @route GET /
// @desc Loads form
router.get('/files', async (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('index', {files: false});
        } else {
            files.map(file => {
                if (
                    file.contentType === 'image/jpeg' ||
                    file.contentType === 'image/png'
                ) {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            res.status(200).send(files);
            // res.render('index', {files: files, title: 'Express'});
        }
    });
});

// @route GET /
// @desc Loads form
router.get('/file/:file', async (req, res) => {
    const file = req.params.file;
    gfs.files.find({"_id": file}).toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('index', {files: false});
        } else {
            files.map(file => {
                if (
                    file.contentType === 'image/jpeg' ||
                    file.contentType === 'image/png'
                ) {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            res.status(200).send(files);
        }
    });
});

// @route POST /upload
// @desc  Uploads file to DB
router.post('/upload', upload.array('file', 10), (req, res) => {
    res.json({"filename": fileSaved});
});

// @route POST /upload
// @desc  Uploads file to DB
router.post('/uploadImgProfil', upload.single("file"), (req, res) => {
    res.json({"filename": fileSaved[0]});
});

// @route GET /files
// @desc  Display all files in JSON
router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }

        // Files exist
        return res.json(files);
    });
});

// @route GET /files/:filename
// @desc  Display single file object
router.get('/files/:_id', (req, res) => {
    gfs.files.findOne(req.params._id, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // File exists
        return res.json(file);
    });
});

// @route GET /image/:filename
// @desc Display Image
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    });
});

// @route DELETE /files/:id
// @desc  Delete file
router.delete('/files/:id', (req, res) => {
    gfs.remove({_id: req.params.id, root: 'uploads'}, (err, gridStore) => {
        if (err) {
            return res.status(404).json({err: err});
        } else {
            return res.status(200).send("success");
        }

        // res.redirect('/');
    });
});

module.exports = router;
