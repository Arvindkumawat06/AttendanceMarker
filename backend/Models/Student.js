import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    rollNumber :  {
        type : String,
        required : true,
        unique : true,
    },
    classId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Class',
        required : true,
    },
    faceDescriptor : {
        type : [Number],
        default : [],
        validate : {
            validator : function(value){
                return value.length === 128 || value.length === 0;
            },
            message : 'Face descriptor must be an array of 128 numbers'
        }
    }
}, {
    timestamps : true
});

const Student = mongoose.model("Student", studentSchema);
export default Student;