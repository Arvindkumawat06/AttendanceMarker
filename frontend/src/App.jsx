import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import DashBoard from './pages/DashBoard.jsx'
import CreateClass from './pages/CreateClass.jsx'
import AddStudent from './pages/AddStudent.jsx'
import { Routes, Route } from 'react-router-dom'
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/create-class" element={<CreateClass />} />
        <Route path="/add-student/:classId" element={<AddStudent />} />
      </Routes>
    </>
  )
}

export default App;
