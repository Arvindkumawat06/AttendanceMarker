import axios from "axios";
import { useEffect, useState } from "react";

const CreateClass = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/teachers/getAllClasses", {
        withCredentials: true,
      })
      .then((response) => {
        setClasses(response.data.classes);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, []);

  return (
    <div>
      <div>
        <p>Add new class</p>
        <input
          type="text"
          placeholder="Class Name"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Handle adding a new class
              const className = e.target.value;
              axios.post("http://localhost:8080/api/teachers/createClass", { name: className }, {
                withCredentials: true,
              })
              .then((response) => {
                console.log("Class created:", response.data);
                setClasses([...classes, response.data.class]);
              })
              .catch((error) => {
                console.error("Error creating class:", error);
              });
            }
          }}
        />
      </div>
      <h1>Your Classes</h1>
      {classes.map((classItem) => (
        <div key={classItem._id}>
          <h2>{classItem.name}</h2>
          <button onClick={() => {
            axios.delete(`http://localhost:8080/api/teachers/deleteClass/${classItem._id}`, {
              withCredentials: true
            })
            .then((response) => {
              console.log("Class deleted:", response.data);
              setClasses(classes.filter((c) => c._id !== classItem._id));
            })
            .catch((error) => {
              console.error("Error deleting class:", error);
            });
          }}>Delete</button>
        </div>
      ))}
      
    </div>
  );
};

export default CreateClass;
