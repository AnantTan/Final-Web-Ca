const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MongoDB_Connection, { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./item.model');