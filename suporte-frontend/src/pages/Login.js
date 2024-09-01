// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';

import './Login.css'; // Importando o CSS

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            alert("Usuário/Senha inválido");
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Usuário:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Digite seu usuário"
                        />
                    </label>
                    <label>
                        Senha:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                        />
                    </label>
                    <button type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
