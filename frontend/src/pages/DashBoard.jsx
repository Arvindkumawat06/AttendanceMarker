import Link from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
const DashBoard = () => {
  const [className, setClassName] = useState('');

  const handleAddClass = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/teacher/create-class', {
        name: className,
        teacherId: '' // Replace with the actual teacher ID
      });
      console.log('Class added:', response.data);
      //avigate to the dashboard page after adding the class
      setClassName(''); // Clear the input field
    } catch(error) {
      console.error("Error adding class:", error.message);
    }
  }
  return (
    <div>
        <h1 style = {{ textAlign: 'center', marginTop: '20px' }}>Welcome to your Dashboard</h1>
    <p style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>
        This is the dashboard page. You can add your dashboard components and logic here.
    </p> 
    <div>
      <h1>Classes</h1>
      <p>Add your class </p>
      <input
        type="text"
        placeholder="Enter class name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />
      <button onClick={handleAddClass}>Add Class</button>
    </div>

    </div>

 )
}

export default DashBoard