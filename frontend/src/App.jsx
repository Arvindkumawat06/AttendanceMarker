import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import DashBoard from './pages/DashBoard.jsx'
import { Routes, Route } from 'react-router-dom'
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </>
  )
}

export default App;
