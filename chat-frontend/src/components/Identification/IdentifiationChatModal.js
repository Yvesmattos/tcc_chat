// src/components/IdentificationForm.js
import React, { useState } from 'react';
import './IdentificationChatModal.css';

const IdentificationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    fone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="input-data tt-submittable" onSubmit={handleSubmit}>
      <div className="group-field">
        <label className="label-placeholder">Nome</label>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          maxLength="250"
          required
          value={formData.nome}
          onChange={handleChange}
        />
      </div>
      <div className="group-field">
        <label className="label-placeholder">E-mail</label>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          maxLength="250"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="group-field">
        <label className="label-placeholder">Telefone</label>
        <input
          type="text"
          name="fone"
          placeholder="Telefone"
          maxLength="20"
          value={formData.fone}
          onChange={handleChange}
        />
      </div>
      <button type="submit" id="send-message-offline">
        <span className="label">Enviar mensagem</span>
        <span className="load">&nbsp;</span>
      </button>
    </form>
  );
};

export default IdentificationForm;
