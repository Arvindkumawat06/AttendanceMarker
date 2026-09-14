import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/api/teachers/login', {
            email,
            password

        }, {
            withCredentials: true
        })
        .then((response) => {
            console.log(response.data);
            navigate('/dashboard');
        })
        .catch((error) => {
            console.error("Error in Login:",error);
        });
    };

    return (
        <div>
            <h1>Login Page</h1>

            <form onSubmit={handleLogin}>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="mail"
                    required
                />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="password"
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;