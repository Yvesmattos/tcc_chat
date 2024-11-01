import React, { useState } from 'react';

function TicketModal({ modalOpen, setModalOpen, handleTicket }) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Chamando a função handleTicket e passando os dados
        await handleTicket({ subject, message });

        // Limpar campos e fechar modal
        setSubject('');
        setMessage('');
        setModalOpen(false)
    };

    // if (!isOpen) return null; // Não renderiza o modal se ele estiver fechado

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Abrir Ticket</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label>Assunto</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>Mensagem</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={styles.textarea}
                            required
                        />
                    </div>
                    <div style={styles.container_buttons}>
                        <button type="button" onClick={() => setModalOpen(false)} style={styles.closeButton}>Fechar</button>
                        <button type="submit" style={styles.button}>Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Estilos básicos para o modal
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '0px !important',
        marginBottom: '10px',
    },
    textarea: {
        width: '100%',
        padding: '0px',
        height: '100px',
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '10px'
    },
    closeButton: {
        backgroundColor: 'gray',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        marginRight: '10px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    container_buttons:{
        display: 'flex',
        justifyContent: 'center' 
    },
};

export default TicketModal;
