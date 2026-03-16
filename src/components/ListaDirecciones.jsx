import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const ListaDirecciones = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [editId, setEditId] = useState(null);
  const [datosEdit, setDatosEdit] = useState({ calle: '', numero: '', colonia: '' });

  const cargarDirecciones = async () => {
    try {
      const res = await api.get('/direccion');
      setDirecciones(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { cargarDirecciones(); }, []);

  const eliminar = async (id) => {
    if (window.confirm("¿Eliminar esta dirección?")) {
      try { await api.delete(`/direccion/${id}`); cargarDirecciones(); } 
      catch (err) { alert("Error al eliminar."); }
    }
  };

  const guardar = async (id) => {
    try {
      await api.put(`/direccion/${id}`, datosEdit);
      setEditId(null);
      cargarDirecciones();
    } catch (err) { alert("Error al actualizar"); }
  };

  const filtrados = direcciones.filter(d => 
    d.idDireccion.toString().includes(busqueda) || 
    d.calle.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ color: '#e67e22', margin: 0 }}>📍 Gestión de Direcciones</h2>
        <input 
          placeholder="🔍 Buscar por ID o Calle..." 
          value={busqueda} 
          onChange={e => setBusqueda(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '25px', border: '2px solid #e67e22', width: '300px', outline: 'none' }}
        />
      </div>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead style={{ background: '#e67e22', color: 'white' }}>
          <tr>
            <th>ID</th>
            <th>Calle</th>
            <th>Número</th>
            <th>Colonia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(d => (
            <tr key={d.idDireccion}>
              <td style={{ fontWeight: 'bold' }}>#{d.idDireccion}</td>
              <td>{editId === d.idDireccion ? <input value={datosEdit.calle} onChange={e => setDatosEdit({...datosEdit, calle: e.target.value})} /> : d.calle}</td>
              <td>{editId === d.idDireccion ? <input value={datosEdit.numero} onChange={e => setDatosEdit({...datosEdit, numero: e.target.value})} /> : d.numero}</td>
              <td>{editId === d.idDireccion ? <input value={datosEdit.colonia} onChange={e => setDatosEdit({...datosEdit, colonia: e.target.value})} /> : d.colonia}</td>
              <td>
                {editId === d.idDireccion ? (
                  <button onClick={() => guardar(d.idDireccion)}>✅</button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => { setEditId(d.idDireccion); setDatosEdit(d); }}>✏️</button>
                    <button onClick={() => eliminar(d.idDireccion)} style={{ color: 'red' }}>🗑️</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaDirecciones;