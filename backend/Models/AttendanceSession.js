import mongoose from "mongoose";
const attendanceSessionSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    records: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true
        },

        status: {
          type: String,
          enum: ["Present", "Absent"],
          required: true
        },

        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const AttendanceSession = mongoose.model(
  "AttendanceSession",
  attendanceSessionSchema
);
export default AttendanceSession;