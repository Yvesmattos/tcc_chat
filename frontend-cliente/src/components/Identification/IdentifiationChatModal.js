// src/components/IdentificationForm.js
import React, { useState } from 'react';
import './IdentificationChatModal.css';
import ReactInputMask from 'react-input-mask';

const IdentificationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
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
    localStorage.setItem('isChatActive', 'true');
    onSubmit(formData);
  };

  return (
    <form className="input-data tt-submittable" onSubmit={handleSubmit}>
      <div className="group-field">
        <label className="label-placeholder">Nome</label>
        <input
          // autoComplete="off"
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
        required={true}
        />
      </div>
      <div className="group-field">
        <label className="label-placeholder">E-mail</label>
        <input
          // autoComplete="off"
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
        required={true}
        />
      </div>
      <div className="group-field">
        <label className="label-placeholder">Telefone</label>
        <ReactInputMask
          // autoComplete="off"
          type="text"
          required={true}
          name="fone"
          value={formData.fone}
          onChange={handleChange}
          mask="(99)99999-9999"
          className="phone-input"
          placeholder="(xx)xxxxx-xxxx"
        >
          {(inputProps) => <input  {...inputProps} type="tel" />}
        </ReactInputMask>
      </div>
      <button type="submit" id="send-message-offline">
        <span className="label">Enviar mensagem</span>
        <span className="load">&nbsp;</span>
      </button>
    </form>
  );
};

export default IdentificationForm;
