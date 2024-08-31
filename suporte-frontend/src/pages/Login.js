// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Atualize a importação
import { login } from '../api/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Atualize para useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard'); // Atualize para usar navigate
        } catch (error) {
            alert("Usuário/Senha inválido")
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Usuário:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Senha:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="submit">Entrar</button>
            </form>
        </div>
    ); 
}

export default Login;
