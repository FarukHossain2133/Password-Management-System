var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Faruk:Faruk01936@cluster0-fqsei.mongodb.net/pms?retryWrites=true&w=majority', {useNewUrlParser: true})
// mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser: true, useCreateIndex: true});

var conn = mongoose.connect;

var passSchema = new mongoose.Schema({
    pws_category: {
            type: String, 
            required: true,
        },
        date: {
            type: Date,
            default: Date.now
        }
});

var passModel = mongoose.model('password_category', passSchema);
module.exports = passModel;