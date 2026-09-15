import Student from '../Models/Student.js';

export const addStudent = async (req, res) => {
    try {
        const { name, rollNumber, faceDescriptor } = req.body;
        const classId = req.params.classId;

        if (!name || !rollNumber) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }

        if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128 ||
          faceDescriptor.some((value) => !Number.isFinite(value))) {
          return res.status(400).json({
            message: 'Capture the student face before adding the student'
          });
        }

        const student = await Student.create({
            name,
            rollNumber,
          classId,
          faceDescriptor
        });

        res.status(201).json({
            message: 'Student added successfully',
            student
        });

    } catch (error) {
        console.error("Error adding student:", error);

        const status = error.code === 11000 ? 409 : 500;
        res.status(status).json({
          message: error.code === 11000 ? 'Roll number already exists' : error.message
        });
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

export const saveFaceDescriptor = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { faceDescriptor } = req.body;

    if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128 ||
        faceDescriptor.some((value) => !Number.isFinite(value))) {
      return res.status(400).json({
        message: 'Face descriptor must contain 128 finite numbers'
      });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { faceDescriptor },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Face descriptor saved successfully',
      student
    });
  } catch (error) {
    console.error('Error saving face descriptor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};