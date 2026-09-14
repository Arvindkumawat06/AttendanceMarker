import axios from "axios";
import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
const AddStudent = () => {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  const { classId } = useParams();
  console.log("classId:", classId);

  useEffect(() => {
    if (!classId) {
      console.error("classId is missing");
      return;
    }

    axios
      .get(
        `http://localhost:8080/api/teachers/getAllStudents/${classId}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setStudents(response.data.students);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, [classId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `http://localhost:8080/api/teachers/addStudent/${classId}`,
        {
          name: studentName,
          rollNumber,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Student added:", response.data);

        setStudents([...students, response.data.student]);
        setStudentName("");
        setRollNumber("");
      })
      .catch((error) => {
        console.error("Error adding student:", error);
      });
  };

  const handleDelete = (studentId) => {
    axios
      .delete(
        `http://localhost:8080/api/teachers/deleteStudent/${studentId}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Student deleted:", response.data);

        setStudents(
          students.filter((student) => student._id !== studentId)
        );
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
      });
  };

  return (
    <div>
      <h1>Students in Class</h1>

      {students.map((student) => (
        <div key={student._id}>
          <p>
            {student.name} - {student.rollNumber}
          </p>

          <button onClick={() => handleDelete(student._id)}>
            Delete
          </button>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />

        <button type="submit">
          Enter
        </button>
      </form>
    </div>
  );
};

export default AddStudent;