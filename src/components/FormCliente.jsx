import React, { useState } from 'react';
import api from '../api/axios';

const FormCliente = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apPaterno: '',
        apMaterno: '',
        email: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/cliente', formData);
            alert("¡Cliente registrado con éxito!");
            // Limpiamos el formulario
            setFormData({ nombre: '', apPaterno: '', apMaterno: '', email: '' });
            window.location.reload(); // Refrescamos para ver al nuevo cliente en la lista
        } catch (error) {
            console.error(error);
            alert("Error al registrar el cliente.");
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3>Nuevo Cliente</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="text" placeholder="Nombre" value={formData.nombre} required
                    onChange={e => setFormData({...formData, nombre: e.target.value})} 
                />
                <input 
                    type="text" placeholder="Apellido Paterno" value={formData.apPaterno} required
                    onChange={e => setFormData({...formData, apPaterno: e.target.value})} 
                />
                <input 
                    type="text" placeholder="Apellido Materno" value={formData.apMaterno} required
                    onChange={e => setFormData({...formData, apMaterno: e.target.value})} 
                />
                <input 
                    type="email" placeholder="Correo Electrónico" value={formData.email} required
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                />
                <button type="submit" style={{ background: '#27ae60', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Registrar Cliente
                </button>
            </form>
        </div>
    );
};

export default FormCliente;