import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const ListaServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para la edición
  const [editId, setEditId] = useState(null);
  const [datosEdit, setDatosEdit] = useState({ descripcion: '', precio: '' });

  const cargarServicios = async () => {
    try {
      const res = await api.get('/servicio');
      setServicios(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al cargar servicios:", err);
    }
  };

  useEffect(() => { cargarServicios(); }, []);

  // Función para eliminar
  const eliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este servicio del catálogo?")) {
      try {
        await api.delete(`/servicio/${id}`);
        cargarServicios();
      } catch (err) {
        alert("No se puede eliminar: el servicio podría estar en uso en una consulta clínica.");
      }
    }
  };

  // Función para guardar cambios
  const guardar = async (id) => {
    try {
      await api.put(`/servicio/${id}`, datosEdit);
      setEditId(null);
      cargarServicios();
    } catch (err) {
      alert("Error al actualizar el servicio.");
    }
  };

  // Filtro por ID o Descripción
  const filtrados = servicios.filter(s => 
    s.idServicio.toString().includes(busqueda) || 
    s.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ 
      padding: '30px', 
      backgroundColor: 'white', 
      borderRadius: '15px', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
      width: '100%' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ color: '#27ae60', margin: 0, fontSize: '28px' }}>💉 Catálogo de Servicios Médicos</h2>
        <input 
          placeholder="🔍 Buscar servicio por ID o nombre..." 
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ 
            padding: '12px 25px', 
            borderRadius: '30px', 
            border: '2px solid #2ecc71', 
            width: '450px', 
            outline: 'none',
            fontSize: '16px'
          }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead style={{ background: '#2ecc71', color: 'white' }}>
          <tr>
            <th style={{ padding: '15px' }}>ID</th>
            <th>Descripción del Servicio</th>
            <th>Precio Unitario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(s => (
            <tr key={s.idServicio} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '15px', fontWeight: 'bold', color: '#27ae60' }}>#{s.idServicio}</td>
              
              {/* Celda de Descripción (Editable) */}
              <td>
                {editId === s.idServicio ? (
                  <input 
                    value={datosEdit.descripcion} 
                    onChange={e => setDatosEdit({...datosEdit, descripcion: e.target.value})}
                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                  />
                ) : s.descripcion}
              </td>

              {/* Celda de Precio (Editable) */}
              <td style={{ fontWeight: 'bold', color: '#27ae60' }}>
                {editId === s.idServicio ? (
                  <input 
                    type="number"
                    value={datosEdit.precio} 
                    onChange={e => setDatosEdit({...datosEdit, precio: e.target.value})}
                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ddd', width: '80px' }}
                  />
                ) : `$${s.precio}`}
              </td>

              {/* Columna de Acciones */}
              <td style={{ padding: '15px' }}>
                {editId === s.idServicio ? (
                  <button 
                    onClick={() => guardar(s.idServicio)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
                  >✅</button>
                ) : (
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button 
                      onClick={() => { setEditId(s.idServicio); setDatosEdit(s); }} 
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}
                      title="Editar"
                    >✏️</button>
                    <button 
                      onClick={() => eliminar(s.idServicio)} 
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', color: '#e74c3c' }}
                      title="Eliminar"
                    >🗑️</button>
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

export default ListaServicios;