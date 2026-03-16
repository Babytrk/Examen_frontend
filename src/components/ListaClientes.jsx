import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import HistorialMascota from './HistorialMascota';

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [editId, setEditId] = useState(null);
  const [datosEdit, setDatosEdit] = useState({ nombre: '', apPaterno: '', email: '' });
  
  const [clienteSel, setClienteSel] = useState(null);
  const [mascotaVer, setMascotaVer] = useState(null);

  const cargarDatos = async () => {
    try {
      const [resC, resM] = await Promise.all([
        api.get('/cliente'),
        api.get('/mascota')
      ]);
      setClientes(Array.isArray(resC.data) ? resC.data : []);
      setMascotas(Array.isArray(resM.data) ? resM.data : []);
    } catch (err) { console.error("Error al cargar datos:", err); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const eliminar = async (id) => {
    if (window.confirm("¿Eliminar cliente? Se perderán sus mascotas y direcciones asociadas.")) {
      try { await api.delete(`/cliente/${id}`); cargarDatos(); } 
      catch (err) { alert("Error al eliminar el cliente."); }
    }
  };

  const guardar = async (id) => {
    try {
      await api.put(`/cliente/${id}`, datosEdit);
      setEditId(null);
      cargarDatos();
    } catch (err) { alert("Error al actualizar datos."); }
  };

  const filtrados = clientes.filter(c => {
    const term = busqueda.toLowerCase();
    return c.idCliente.toString().includes(term) || 
           c.nombre.toLowerCase().includes(term) || 
           c.apPaterno.toLowerCase().includes(term);
  });

  return (
    <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ color: '#8e44ad', margin: 0, fontSize: '28px' }}>🚀 Panel de Control: Gestión de Clientes</h2>
        <input 
          placeholder="🔍 Buscar por ID, Nombre o Apellido..." 
          value={busqueda} 
          onChange={e => setBusqueda(e.target.value)}
          style={{ padding: '12px 25px', borderRadius: '30px', border: '2px solid #9b59b6', width: '500px', outline: 'none', fontSize: '16px' }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead style={{ background: '#9b59b6', color: 'white' }}>
          <tr>
            <th style={{ padding: '15px' }}>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(c => {
            const misMascotas = mascotas.filter(m => m.cliente && m.cliente.idCliente === c.idCliente);
            const abierto = clienteSel === c.idCliente;
            
            return (
              <React.Fragment key={c.idCliente}>
                <tr style={{ borderBottom: '1px solid #eee', backgroundColor: abierto ? '#fdfaff' : 'transparent' }}>
                  <td style={{ fontWeight: 'bold', padding: '18px' }}>#{c.idCliente}</td>
                  <td>{editId === c.idCliente ? <input value={datosEdit.nombre} onChange={e => setDatosEdit({...datosEdit, nombre: e.target.value})} /> : c.nombre}</td>
                  <td>{editId === c.idCliente ? <input value={datosEdit.apPaterno} onChange={e => setDatosEdit({...datosEdit, apPaterno: e.target.value})} /> : c.apPaterno}</td>
                  <td>{editId === c.idCliente ? <input value={datosEdit.email} onChange={e => setDatosEdit({...datosEdit, email: e.target.value})} /> : c.email}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                      <button onClick={() => setClienteSel(abierto ? null : c.idCliente)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '22px' }} title="Ver Detalles">👁️</button>
                      <button onClick={() => { setEditId(c.idCliente); setDatosEdit(c); }} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }} title="Editar">✏️</button>
                      <button onClick={() => eliminar(c.idCliente)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: '#e74c3c' }} title="Eliminar">🗑️</button>
                    </div>
                  </td>
                </tr>

                {/* SECCIÓN DESPLEGABLE: DIRECCIÓN + MASCOTAS */}
                {abierto && (
                  <tr>
                    <td colSpan="5" style={{ padding: '25px', backgroundColor: '#fcf8ff', borderBottom: '3px solid #9b59b6' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', textAlign: 'left', paddingLeft: '20px' }}>
                        
                        {/* 1. Datos de Dirección */}
                        <div style={{ borderRight: '1px solid #ddd', paddingRight: '20px' }}>
                          <h4 style={{ color: '#e67e22', marginBottom: '10px' }}>📍 Dirección de Contacto:</h4>
                          {c.direccion ? (
                            <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
                              <p style={{margin: 0}}><strong>Calle:</strong> {c.direccion.calle} #{c.direccion.numero}</p>
                              <p style={{margin: 0}}><strong>Colonia:</strong> {c.direccion.colonia}</p>
                              <p style={{margin: 0, color: '#7f8c8d'}}><small>ID Dirección: #{c.direccion.idDireccion}</small></p>
                            </div>
                          ) : (
                            <p style={{ color: '#95a5a6', fontStyle: 'italic' }}>Sin dirección registrada.</p>
                          )}
                        </div>

                        {/* 2. Lista de Mascotas */}
                        <div>
                          <h4 style={{ color: '#8e44ad', marginBottom: '15px' }}>🐾 Mascotas de {c.nombre}:</h4>
                          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            {misMascotas.length > 0 ? misMascotas.map(m => (
                              <div key={m.idMascota} style={{ background: 'white', padding: '12px 18px', borderRadius: '12px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                <span style={{ fontWeight: 'bold' }}>{m.nombre} <small>({m.tipo})</small></span>
                                <button onClick={() => setMascotaVer(m)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Historial</button>
                              </div>
                            )) : <span style={{ color: '#95a5a6' }}>Sin mascotas registradas.</span>}
                          </div>
                        </div>

                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {mascotaVer && (
        <HistorialMascota 
          idMascota={mascotaVer.idMascota} 
          nombreMascota={mascotaVer.nombre} 
          onClose={() => setMascotaVer(null)} 
        />
      )}
    </div>
  );
};

export default ListaClientes;