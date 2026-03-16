import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import HistorialMascota from './HistorialMascota';

const ListaMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mascotaVer, setMascotaVer] = useState(null);
  const [editId, setEditId] = useState(null);
  const [datosEdit, setDatosEdit] = useState({ nombre: '', tipo: '', edad: 0 });

  const cargarMascotas = async () => {
    try {
      const res = await api.get('/mascota');
      setMascotas(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { cargarMascotas(); }, []);

  const eliminar = async (id) => {
    if (window.confirm("¿Eliminar mascota?")) {
      try { await api.delete(`/mascota/${id}`); cargarMascotas(); } 
      catch (err) { alert("Error al eliminar"); }
    }
  };

  const guardar = async (id) => {
    try {
      const original = mascotas.find(m => m.idMascota === id);
      await api.put(`/mascota/${id}`, { ...original, ...datosEdit });
      setEditId(null);
      cargarMascotas();
    } catch (err) { alert("Error al actualizar"); }
  };

  const filtradas = mascotas.filter(m => {
    const term = busqueda.toLowerCase();
    const dueno = m.cliente ? `${m.cliente.nombre} ${m.cliente.apPaterno}`.toLowerCase() : "";
    return m.idMascota.toString().includes(term) || 
           m.nombre.toLowerCase().includes(term) || 
           dueno.includes(term);
  });

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ color: '#2980b9', margin: 0 }}>🐕 Inventario de Pacientes</h2>
        <input 
          placeholder="🔍 Buscar por ID, Mascota o Dueño..." 
          value={busqueda} 
          onChange={e => setBusqueda(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '25px', border: '2px solid #3498db', width: '350px', outline: 'none' }}
        />
      </div>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead style={{ background: '#3498db', color: 'white' }}>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Dueño</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map(m => (
            <tr key={m.idMascota}>
              <td style={{ fontWeight: 'bold' }}>#{m.idMascota}</td>
              <td>{editId === m.idMascota ? <input value={datosEdit.nombre} onChange={e => setDatosEdit({...datosEdit, nombre: e.target.value})} /> : m.nombre}</td>
              <td>{editId === m.idMascota ? <input type="number" value={datosEdit.edad} onChange={e => setDatosEdit({...datosEdit, edad: e.target.value})} /> : m.edad}</td>
              <td>{m.cliente ? `${m.cliente.nombre} ${m.cliente.apPaterno}` : "S/D"}</td>
              <td>
                {editId === m.idMascota ? (
                  <button onClick={() => guardar(m.idMascota)}>✅</button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button onClick={() => setMascotaVer(m)} title="Ver Historial">👁️</button>
                    <button onClick={() => { setEditId(m.idMascota); setDatosEdit(m); }} title="Editar">✏️</button>
                    <button onClick={() => eliminar(m.idMascota)} style={{ color: 'red' }} title="Eliminar">🗑️</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {mascotaVer && <HistorialMascota idMascota={mascotaVer.idMascota} nombreMascota={mascotaVer.nombre} onClose={() => setMascotaVer(null)} />}
    </div>
  );
};

export default ListaMascotas;