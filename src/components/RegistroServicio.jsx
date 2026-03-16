import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const RegistroServicio = () => {
  // 1. BLINDAJE: Inicializamos siempre como arreglos vacíos
  const [mascotas, setMascotas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [registro, setRegistro] = useState({
    idMascota: '',
    idServicio: '',
    nota: '',
    fecha: new Date().toISOString().slice(0, 16) // Fecha actual para el input datetime-local
  });

  const cargarDatos = async () => {
    try {
      const [resM, resS] = await Promise.all([
        api.get('/mascota'),
        api.get('/servicio')
      ]);
      
      // 2. VALIDACIÓN: Solo guardamos si el backend respondió con una lista
      setMascotas(Array.isArray(resM.data) ? resM.data : []);
      setServicios(Array.isArray(resS.data) ? resS.data : []);
    } catch (err) {
      console.error("Error al cargar datos para clínica", err);
      setMascotas([]);
      setServicios([]);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      fecha: registro.fecha,
      nota: registro.nota,
      mascota: { idMascota: parseInt(registro.idMascota) },
      servicio: { idServicio: parseInt(registro.idServicio) }
    };

    try {
      await api.post('/mascota-servicio', payload);
      alert("✨ ¡Servicio registrado en el historial!");
      setRegistro({ ...registro, nota: '', idMascota: '', idServicio: '' });
    } catch (err) {
      alert("Error al registrar servicio clínico.");
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>🩺 Registro Clínico (Atención)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <label>Seleccionar Paciente (Mascota):</label>
        <select 
          value={registro.idMascota} 
          onChange={e => setRegistro({...registro, idMascota: e.target.value})}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        >
          <option value="">-- Seleccionar Mascota --</option>
          {/* 3. El .map ya no fallará gracias al blindaje inicial */}
          {Array.isArray(mascotas) && mascotas.map(m => (
            <option key={m.idMascota} value={m.idMascota}>{m.nombre} ({m.tipo})</option>
          ))}
        </select>

        <label>Seleccionar Servicio:</label>
        <select 
          value={registro.idServicio} 
          onChange={e => setRegistro({...registro, idServicio: e.target.value})}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        >
          <option value="">-- Seleccionar Servicio --</option>
          {Array.isArray(servicios) && servicios.map(s => (
            <option key={s.idServicio} value={s.idServicio}>{s.descripcion} - ${s.precio}</option>
          ))}
        </select>

        <label>Fecha de Atención:</label>
        <input 
          type="datetime-local" 
          value={registro.fecha} 
          onChange={e => setRegistro({...registro, fecha: e.target.value})}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />

        <label>Notas / Observaciones Médicas:</label>
        <textarea 
          placeholder="Escribe aquí los síntomas o el resultado de la consulta..."
          value={registro.nota}
          onChange={e => setRegistro({...registro, nota: e.target.value})}
          rows="4"
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />

        <button type="submit" style={{ backgroundColor: '#9b59b6', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Finalizar y Guardar en Expediente
        </button>
      </form>
    </div>
  );
};

export default RegistroServicio;