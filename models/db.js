const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect('mongodb+srv://tescoDb:Pass1234!@mytescodb-67a8e.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./item.model');