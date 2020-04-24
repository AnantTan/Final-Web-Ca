const mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    sec: {
        type: Number
    },
    item: {
        type: String
    },
    price: {
        type: Number
    }
});

mongoose.model('Item', itemSchema);