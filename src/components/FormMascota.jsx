import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const FormMascota = () => {
  const [nuevaMascota, setNuevaMascota] = useState({
    nombre: '',
    sexo: 'M',
    tipo: '',
    edad: 0,
    enPeligro: false,
    idCliente: ''
  });
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const res = await api.get('/cliente');
        setClientes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error al cargar dueños", err);
      }
    };
    cargarClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Construimos el objeto exacto que espera Spring Boot
    const payload = {
      nombre: nuevaMascota.nombre,
      sexo: nuevaMascota.sexo,
      tipo: nuevaMascota.tipo,
      edad: nuevaMascota.edad,
      enPeligro: nuevaMascota.enPeligro,
      cliente: { idCliente: parseInt(nuevaMascota.idCliente) }
    };

    try {
      await api.post('/mascota', payload);
      alert("✨ ¡Mascota registrada exitosamente!");
      setNuevaMascota({ nombre: '', sexo: 'M', tipo: '', edad: 0, enPeligro: false, idCliente: '' });
    } catch (err) {
      alert("Error al registrar: Verifica que el dueño esté seleccionado.");
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '500px', margin: 'auto' }}>
      <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>📝 Registro de Nuevo Paciente</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          placeholder="Nombre de la mascota" 
          value={nuevaMascota.nombre} 
          onChange={e => setNuevaMascota({...nuevaMascota, nombre: e.target.value})} 
          required 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        <input 
          placeholder="Especie/Raza (Ej: Gato, Perro Labrador)" 
          value={nuevaMascota.tipo} 
          onChange={e => setNuevaMascota({...nuevaMascota, tipo: e.target.value})} 
          required 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={nuevaMascota.sexo} 
            onChange={e => setNuevaMascota({...nuevaMascota, sexo: e.target.value})}
            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="M">Macho</option>
            <option value="H">Hembra</option>
          </select>
          <input 
            type="number" 
            placeholder="Edad" 
            value={nuevaMascota.edad} 
            onChange={e => setNuevaMascota({...nuevaMascota, edad: e.target.value})}
            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        <select 
          value={nuevaMascota.idCliente} 
          onChange={e => setNuevaMascota({...nuevaMascota, idCliente: e.target.value})}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #3498db', backgroundColor: '#f0f8ff' }}
        >
          <option value="">-- Seleccionar Dueño --</option>
          {clientes.map(c => (
            <option key={c.idCliente} value={c.idCliente}>{c.nombre} {c.apPaterno}</option>
          ))}
        </select>

        <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Guardar Mascota
        </button>
      </form>
    </div>
  );
};

export default FormMascota;