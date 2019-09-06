var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Faruk:Faruk01936@cluster0-fqsei.mongodb.net/pms?retryWrites=true&w=majority', {useNewUrlParser: true})
// mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser: true, useCreateIndex: true});

var conn = mongoose.connect;

var addPassSchema = new mongoose.Schema({
    password_category: {
            type: String, 
            required: true,
            index: {
                unique: true
            }
        },
        project_name: {
            type: String, 
            required: true,
        },
        password_details: {
            type: String, 
            required: true,
        },
        date: {
            type: Date,
            default: Date.now
        }
});

var addPassModule = mongoose.model('password_details', addPassSchema);
module.exports = addPassModule;