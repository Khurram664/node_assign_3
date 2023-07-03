const express = require('express');

//const verifyToken = require('./modules/verifyToken');
const db = require('./modules/dbConnection');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_JWT_KEY;

require('dotenv').config();

const verifyToken = (req, res, next) => {


    console.log('verify token');

    console.log(req.headers.authorization);


    const token =
        req.headers.authorization && req.headers.authorization.split(' ')[1];


    if (!token) {
        return res
            .status(401)
            .json({ message: 'Access denied. Token is missing.' });
    }

    console.log('before try');

    try {

        const decodedToken = jwt.verify(token, secretKey);
        console.log('decoded Token');
        console.log(decodedToken);
        const { username, password } = decodedToken;
        req.user = { username, password };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Access denied. Invalid token.' });
    }
};

const app = express();
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/login_user', function (req, res) {

    var username = req.body.username;
    var password = req.body.password;

    db.model('User').findOne({
        'username': username,
        'password': password
    }).then((data) => {
        console.log('User Found.');

        const token = jwt.sign({ username: username, password: password }, secretKey, { expiresIn: '1h' });
        res.json({
            'token': token,
            'username': username
        });

    }).catch(err => res.status(500).json({ message: err.message }));
});

app.get('/products', function (req, res) {


    console.log('In products');
    db.model('Product').find().
        then(products => res.json({ products })).
        catch(err => res.status(500).json({ message: err.message }));
});

app.post('/add_product', verifyToken, function (req, res) {

    console.log('Add Product');
    console.log(req.body.name);
    var name = req.body.name;
    var price = req.body.price;
    var category = req.body.category;


    db.model('Product').create({
        'name': name,
        'price': price,
        'category': category
    }).then((data) => {
        console.log('Product Created');
        res.json(data);

    })
        .catch(err => res.status(500).json({ message: err.message }));
});

app.post('/add_user', verifyToken, function (req, res) {

    console.log('Add user');
    console.log(req.body.name);
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;


    db.model('User').create({
        'name': name,
        'username': username,
        'password': password,
    }).then((data) => {
        console.log('User Created');
        res.json(data);

    })
        .catch(err => res.status(500).json({ message: err.message }));
});

app.post('/update_user', verifyToken, function (req, res) {

    console.log('Find users from', db.name);
    var name = req.body.name;
    var password = req.body.password;

    db.model('User').updateOne({
        'password': password
    }, {
            'name': name
        }).then((data) => {
            console.log('User Updated');
            res.json(data);

        })
        .catch(err => res.status(500).json({ message: err.message }));
});

app.post('/delete_user', verifyToken, function (req, res) {


    var name = req.body.username;

    db.model('User').deleteOne({
        'username': username,
    }).then((data) => {
        console.log('User Deleted');
        res.json(data);

    }).catch(err => res.status(500).json({ message: err.message }));
});


port = 3000;

app.listen(port, () => {
    console.log("Hello world assignment3");
    console.log(`Example app listening on port ${port}`);
})
