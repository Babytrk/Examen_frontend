import React, { useState } from 'react';
import api from '../api/axios';

const FormDireccion = () => {
    const [formData, setFormData] = useState({
        calle: '',
        numero: '',
        idCliente: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Estructura para el controlador DireccionController
        const payload = {
            calle: formData.calle,
            numero: formData.numero,
            cliente: { idCliente: parseInt(formData.idCliente) }
        };

        try {
            // Este POST en tu backend ya tiene la lógica para actualizar si ya existe
            await api.post('/direccion', payload);
            alert("Dirección guardada/actualizada con éxito.");
            setFormData({ calle: '', numero: '', idCliente: '' });
        } catch (error) {
            console.error(error);
            alert("Error: Asegúrate de que el ID del cliente sea válido.");
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3>Asignar Dirección</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="number" placeholder="ID del Cliente" value={formData.idCliente} required
                    onChange={e => setFormData({...formData, idCliente: e.target.value})} 
                />
                <input 
                    type="text" placeholder="Calle" value={formData.calle} required
                    onChange={e => setFormData({...formData, calle: e.target.value})} 
                />
                <input 
                    type="text" placeholder="Número" value={formData.numero} required
                    onChange={e => setFormData({...formData, numero: e.target.value})} 
                />
                <button type="submit" style={{ background: '#f39c12', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Guardar Dirección
                </button>
            </form>
        </div>
    );
};

export default FormDireccion; 