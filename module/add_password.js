var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate')

mongoose.connect('mongodb+srv://Faruk:Faruk01936@cluster0-fqsei.mongodb.net/pms?retryWrites=true&w=majority', {useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true});
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
addPassSchema.plugin(mongoosePaginate);

var addPassModule = mongoose.model('password_details', addPassSchema);
module.exports = addPassModule;