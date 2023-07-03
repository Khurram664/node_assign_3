const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.CONNECTIONSTRING);
mongoose.set('debug', true);

//mongoose.model('User', mongoose.Schema({ name: String }));
const db = mongoose.connection.useDb(`node_assignment_3`, {
    // `useCache` tells Mongoose to cache connections by database name, so
    // `mongoose.connection.useDb('foo', { useCache: true })` returns the
    // same reference each time.
    useCache: true
});

// Need to register models every time a new connection is created
if (!db.models['Product']) {
    db.model('Product', mongoose.Schema({
        name: String,
        price: Number,
        category: String,
        id: Number
    }));
}


if (!db.models['User']) {
    db.model('User', mongoose.Schema({
        name: String,
        password: String,
        username: String,
        id: Object
    }));
}

if (!db.models['Cart']) {
    db.model('Cart', mongoose.Schema({
        username: String,
        products: Array,
        total_price: Number,
        id: Object
    }));
}
module.exports = db;

