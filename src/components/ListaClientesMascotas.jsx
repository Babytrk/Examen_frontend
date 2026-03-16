import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import HistorialMascota from './HistorialMascota';

const ListaClientesMascotas = () => {
  const [clientes, setClientes] = useState([]);
  const [mascotaVer, setMascotaVer] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resClientes, resMascotas] = await Promise.all([
          api.get('/cliente'),
          api.get('/mascota')
        ]);
        
        // Unimos las mascotas a sus respectivos dueños
        const clientesConMascotas = resClientes.data.map(c => ({
          ...c,
          mascotas: resMascotas.data.filter(m => m.cliente && m.cliente.idCliente === c.idCliente)
        }));
        setClientes(clientesConMascotas);
      } catch (err) { console.error(err); }
    };
    cargarDatos();
  }, []);

  const filtrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    c.idCliente.toString().includes(busqueda)
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>👥 Clientes y sus Mascotas</h2>
        <input 
          placeholder="🔍 Buscar cliente por nombre o ID..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: '10px', borderRadius: '20px', width: '300px', border: '1px solid #ccc' }}
        />
      </div>

      {filtrados.map(cliente => (
        <div key={cliente.idCliente} style={{ 
          backgroundColor: 'white', 
          marginBottom: '15px', 
          padding: '15px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderLeft: '5px solid #9b59b6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>{cliente.nombre} {cliente.apPaterno} <small>(ID: #{cliente.idCliente})</small></h3>
            <span style={{ color: '#7f8c8d' }}>📧 {cliente.email}</span>
          </div>
          
          <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
            <h4 style={{ fontSize: '0.9em', color: '#34495e' }}>🐾 Mascotas Registradas:</h4>
            {cliente.mascotas.length > 0 ? (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {cliente.mascotas.map(m => (
                  <div key={m.idMascota} style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '8px 12px', 
                    borderRadius: '8px', 
                    border: '1px solid #dee2e6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <strong>{m.nombre}</strong> ({m.tipo})
                    <button 
                      onClick={() => setMascotaVer(m)}
                      style={{ cursor: 'pointer', border: 'none', background: '#3498db', color: 'white', borderRadius: '4px', padding: '2px 8px' }}
                    >
                      👁️ Ver Historial
                    </button>
                  </div>
                ))}
              </div>
            ) : <p style={{ fontSize: '0.85em', color: '#95a5a6' }}>Sin mascotas vinculadas.</p>}
          </div>
        </div>
      ))}

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

export default ListaClientesMascotas;