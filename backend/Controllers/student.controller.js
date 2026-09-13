import Student from '../Models/Student.js';

export const addStudent = async (req, res) => {
  try{
      const { name, rollNumber } = req.body;
    const classId = req.params.classId
    const student = await Student.create({ name, rollNumber, classId });

    res.status(201).json({ message: 'Student added successfully', student });
  }  
  catch (error) {
    console.error("`Error adding student:", error); 
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const classId = req.params.classId;
    const students = await Student.find({ classId });
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    await Student.findByIdAndDelete(studentId);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};