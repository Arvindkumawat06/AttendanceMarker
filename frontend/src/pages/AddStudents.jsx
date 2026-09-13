import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const AddStudents = () => {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const classId = useLocation().state?.classId; // Get classId from state passed via Link

  useEffect(() => {
    // Fetch students for the current class
    axios.get(`http://localhost:8080/api/teachers/getAllStudents/${classId}`,{
        withCredentials: true
    })
      .then((response) => {
        setStudents(response.data.students);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, [classId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:8080/api/teachers/addStudent/${classId}`, { name: studentName, rollNumber }, {
        withCredentials: true
    })
      .then((response) => {
        console.log("Student added:", response.data);
        setStudents([...students, response.data.student]);
        setStudentName('');
        setRollNumber('');
      })
      .catch((error) => {
        console.error("Error adding student:", error);
      });
  };

  return (
    <div>
        <div>
            <h1>Students in Class</h1>
            {students.map((student) => (
                <><div key={student._id}>
                    <p>{student.name} - {student.rollNumber}</p>
                </div><button onClick={() => {
                    axios.delete(`http://localhost:8080/api/teachers/deleteStudent/${student._id}`, {
                        withCredentials: true
                    })
                        .then((response) => {
                            console.log("Student deleted:", response.data);
                            setStudents(students.filter((s) => s._id !== student._id));
                        })
                        .catch((error) => {
                            console.error("Error deleting student:", error);
                        });
                } }>Delete</button></>
            ))}
        </div>
        <form  >
            <input 
                type="text"
                placeholder="Student Name"
                onChange={(e) => setStudentName(e.target.value)}
                value={studentName}
            />
            <input 
                type="text"
                placeholder="Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
            />
            <button type="submit" onSubmit={handleSubmit}>Enter</button>
        </form>
    </div>
  )
}

export default AddStudents