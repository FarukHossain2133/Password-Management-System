var mongoose =  require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser: true, useCreateIndex: true});
var conn = mongoose.connect;

var userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        index: {
            unique:  true
        }
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
        }
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var userModel = mongoose.model('users', userSchema);
module.exports = userModel;