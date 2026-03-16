import React, { useState } from 'react';
import api from '../api/axios';

const CrearServicio = () => {
    const [formData, setFormData] = useState({
        descripcion: '',
        precio: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/servicio', {
                descripcion: formData.descripcion,
                precio: parseFloat(formData.precio)
            });
            alert("¡Servicio añadido al catálogo!");
            setFormData({ descripcion: '', precio: '' });
            window.location.reload(); // Para que aparezca en el selector de RegistroServicio
        } catch (error) {
            console.error(error);
            alert("Error al crear el servicio.");
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3>Añadir al Catálogo de Servicios</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="text" placeholder="Ej: Vacuna Quíntuple" value={formData.descripcion} required
                    onChange={e => setFormData({...formData, descripcion: e.target.value})} 
                />
                <input 
                    type="number" placeholder="Precio (Ej: 350)" value={formData.precio} required
                    onChange={e => setFormData({...formData, precio: e.target.value})} 
                />
                <button type="submit" style={{ background: '#9b59b6', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Guardar Servicio
                </button>
            </form>
        </div>
    );
};

export default CrearServicio;