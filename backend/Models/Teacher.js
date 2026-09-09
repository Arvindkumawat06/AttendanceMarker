import mongoose from 'mongoose';

const teacherSchema =new  mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 8,
        maxlength : 108
    }
}, {
    timestamps : true
});


const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;