import mongoose from "mongoose";
import AttendanceSession from "../Models/AttendanceSession.js";
import Student from "../Models/Student.js";


// Create attendance session
export const createAttendanceSession = async (req, res) => {
    try {
        const { classId } = req.params;
        const { date, records } = req.body;

        // Validate class ID
        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({
                message: "Invalid class ID"
            });
        }

        // Validate date
        if (!date) {
            return res.status(400).json({
                message: "Date is required"
            });
        }

        // Validate records
        if (!Array.isArray(records)) {
            return res.status(400).json({
                message: "Records must be an array"
            });
        }

        // Check if attendance already exists
        const existingSession = await AttendanceSession.findOne({
            classId,
            date: new Date(date)
        });

        if (existingSession) {
            return res.status(400).json({
                message: "Attendance already marked for this date"
            });
        }

        // Get students belonging to this class
        const students = await Student.find({ classId }).select("_id");

        const studentIds = students.map(
            (student) => student._id.toString()
        );

        // Validate attendance records
        for (const record of records) {

            if (!mongoose.Types.ObjectId.isValid(record.studentId)) {
                return res.status(400).json({
                    message: "Invalid student ID"
                });
            }

            if (!studentIds.includes(record.studentId.toString())) {
                return res.status(400).json({
                    message: "Student does not belong to this class"
                });
            }

            if (!["Present", "Absent"].includes(record.status)) {
                return res.status(400).json({
                    message: "Invalid attendance status"
                });
            }
        }

        // Create attendance
        const attendanceSession = await AttendanceSession.create({
            classId,
            date: new Date(date),
            records
        });

        res.status(201).json({
            message: "Attendance created successfully",
            attendanceSession
        });

    } catch (error) {
        console.error("Error creating attendance:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getAttendanceHistory = async (req, res) => {
    try {
        const { classId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({
                message: "Invalid class ID"
            });
        }

        const sessions = await AttendanceSession
            .find({ classId })
            .populate("records.studentId", "name rollNumber")
            .sort({ date: -1 });

        res.status(200).json({
            sessions
        });

    } catch (error) {
        console.error("Error fetching attendance history:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};
export const updateAttendance = async (req, res) => {
    try {
        const { sessionId, studentId } = req.params;
        const { status } = req.body;

        if (!["Present", "Absent"].includes(status)) {
            return res.status(400).json({
                message: "Invalid attendance status"
            });
        }

        const session = await AttendanceSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                message: "Attendance session not found"
            });
        }

        const record = session.records.find(
            (record) =>
                record.studentId.toString() === studentId
        );

        if (!record) {
            return res.status(404).json({
                message: "Student attendance record not found"
            });
        }

        record.status = status;
        record.timestamp = new Date();

        await session.save();

        res.status(200).json({
            message: "Attendance updated successfully",
            session
        });

    } catch (error) {
        console.error("Error updating attendance:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getAttendanceByDate = async (req, res) => {
    try {
        const { classId, date } = req.params;

        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({
                message: "Invalid class ID"
            });
        }

        const attendanceSession = await AttendanceSession
            .findOne({
                classId,
                date: new Date(date)
            })
            .populate("records.studentId", "name rollNumber");

        if (!attendanceSession) {
            return res.status(404).json({
                message: "Attendance not found for this date"
            });
        }

        res.status(200).json({
            attendanceSession
        });

    } catch (error) {
        console.error("Error fetching attendance:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

    const descriptorDistance = (left, right) => {
        let dot = 0;
        let leftMagnitude = 0;
        let rightMagnitude = 0;

        for (let index = 0; index < left.length; index += 1) {
            dot += left[index] * right[index];
            leftMagnitude += left[index] ** 2;
            rightMagnitude += right[index] ** 2;
        }

        if (!leftMagnitude || !rightMagnitude) {
            return Number.POSITIVE_INFINITY;
        }

        return 1 - dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
    };

    export const markAttendanceByFace = async (req, res) => {
        try {
            const { classId } = req.params;
            const { faceDescriptor } = req.body;

            if (!mongoose.Types.ObjectId.isValid(classId)) {
                return res.status(400).json({ message: 'Invalid class ID' });
            }

            if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128 ||
                faceDescriptor.some((value) => !Number.isFinite(value))) {
                return res.status(400).json({
                    message: 'Face descriptor must contain 128 finite numbers'
                });
            }

            const students = await Student.find({ classId });
            const enrolledStudents = students.filter(
                (student) => student.faceDescriptor?.length === 128
            );

            if (!enrolledStudents.length) {
                return res.status(404).json({
                    message: 'No students in this class have enrolled face descriptors'
                });
            }

            const match = enrolledStudents.reduce((closest, student) => {
                const distance = descriptorDistance(faceDescriptor, student.faceDescriptor);
                return !closest || distance < closest.distance
                    ? { student, distance }
                    : closest;
            }, null);

            if (match.distance > 0.5) {
                return res.status(404).json({
                    message: 'Face not recognized',
                    distance: match.distance
                });
            }

            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(endOfDay.getDate() + 1);

            let session = await AttendanceSession.findOne({
                classId,
                date: { $gte: startOfDay, $lt: endOfDay }
            });

            if (!session) {
                session = await AttendanceSession.create({
                    classId,
                    date: startOfDay,
                    records: students.map((student) => ({
                        studentId: student._id,
                        status: student._id.equals(match.student._id) ? 'Present' : 'Absent'
                    }))
                });
            } else {
                const record = session.records.find(
                    (item) => item.studentId.equals(match.student._id)
                );

                if (record) {
                    record.status = 'Present';
                    record.timestamp = new Date();
                } else {
                    session.records.push({
                        studentId: match.student._id,
                        status: 'Present'
                    });
                }

                await session.save();
            }

            res.status(200).json({
                message: 'Attendance marked successfully',
                distance: match.distance,
                student: {
                    id: match.student._id,
                    name: match.student.name,
                    rollNumber: match.student.rollNumber
                },
                session
            });
        } catch (error) {
            console.error('Error marking attendance by face:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };