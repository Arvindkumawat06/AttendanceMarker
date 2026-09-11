import  { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/teachers/register', {
            name,
            email,
            password    
        })
        .then((response) => {
            navigate('/dashboard');
            console.log(response);
        }).catch((error) => {
            console.error("Error in SignUp:",error);
        });
    };
  return (
    <div>
        <h1 style = {{ textAlign: 'center', marginTop: '20px' }}>Welcome to your SignUp Page</h1>
        <form>
            <input
                value = {name}
                onChange={(e) => setName(e.target.value)}
                type="text" placeholder="Name" required 
            />
            <input
                value = {email}
                onChange={(e) => setEmail(e.target.value)}
                type="email" placeholder="Email" required 
            />
            <input
                value = {password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" placeholder="Password" required 
            />
           
            <button onClick={handleSubmit} type="submit">Sign Up</button>
        </form>
    </div>
  )
}

export default SignUpPage