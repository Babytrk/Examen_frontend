import React, { useState } from 'react';
import api from '../api/axios';

const FormServicio = ({ onServicioAgregado }) => {
  const [servicio, setServicio] = useState({
    descripcion: '',
    precio: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviamos los datos al backend (IntelliJ)
      await api.post('/servicio', servicio);
      
      alert("✅ Servicio guardado correctamente en el catálogo.");
      
      // Limpiamos el formulario
      setServicio({ descripcion: '', precio: '' });
      
      // Si le pasamos una función para recargar la lista, la ejecutamos
      if (onServicioAgregado) onServicioAgregado();
      
    } catch (err) {
      console.error("Error al guardar servicio:", err);
      alert("❌ No se pudo guardar el servicio. Revisa la conexión.");
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '20px auto', 
      padding: '25px', 
      backgroundColor: '#fff', 
      borderRadius: '12px', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
    }}>
      <h3 style={{ color: '#2ecc71', textAlign: 'center', marginBottom: '20px' }}>
        💉 Nuevo Servicio Médico
      </h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción:</label>
          <input 
            type="text"
            placeholder="Ej: Vacuna Rabia, Baño, Consulta..."
            value={servicio.descripcion}
            onChange={(e) => setServicio({...servicio, descripcion: e.target.value})}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Precio ($):</label>
          <input 
            type="number"
            placeholder="0.00"
            value={servicio.precio}
            onChange={(e) => setServicio({...servicio, precio: e.target.value})}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        <button 
          type="submit"
          style={{ 
            backgroundColor: '#2ecc71', 
            color: 'white', 
            padding: '12px', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          ➕ Registrar Servicio
        </button>
      </form>
    </div>
  );
};

export default FormServicio;