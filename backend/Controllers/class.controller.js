import Class from "../Models/Class.js";

export const createClass = async (req,res) => {
    const { name } = req.body;
    try{
        const newClass = await Class.create({ name, teacherId: req.teacher._id});
        res.status(201).json({ message: 'Class created successfully', class: newClass });
    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find({ teacherId : req.teacher._id });
        res.status(200).json({ classes });
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const  deleteClass = async (req, res) => {
    const classId = req.params.id;
    try {
        await Class.findByIdAndDelete(classId);
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error deleting class', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}