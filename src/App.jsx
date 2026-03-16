import React, { useState } from 'react';
import ListaClientes from './components/ListaClientes';
import ListaMascotas from './components/ListaMascotas';
import ListaServicios from './components/ListaServicios';
import ListaDirecciones from './components/ListaDirecciones';
import FormCliente from './components/FormCliente';
import FormDireccion from './components/FormDireccion';
import FormMascota from './components/FormMascota';
import RegistroServicio from './components/RegistroServicio';
import CrearServicio from './components/CrearServicio';

function App() {
  const [tab, setTab] = useState('inicio');

  const navButtonStyle = (active) => ({
    padding: '15px 25px',
    cursor: 'pointer',
    backgroundColor: active ? '#34495e' : 'transparent',
    color: 'white',
    border: 'none',
    borderBottom: active ? '4px solid #3498db' : 'none',
    fontSize: '16px',
    fontWeight: active ? 'bold' : 'normal',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <nav style={{ background: '#2c3e50', display: 'flex', justifyContent: 'center', padding: '0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <button onClick={() => setTab('inicio')} style={navButtonStyle(tab === 'inicio')}>🏠 Inicio</button>
        <button onClick={() => setTab('clientes')} style={navButtonStyle(tab === 'clientes')}>👥 Clientes</button>
        <button onClick={() => setTab('mascotas')} style={navButtonStyle(tab === 'mascotas')}>🐕 Mascotas</button>
        <button onClick={() => setTab('servicios')} style={navButtonStyle(tab === 'servicios')}>💉 Servicios</button>
        <button onClick={() => setTab('clinica')} style={navButtonStyle(tab === 'clinica')}>🩺 Clínica</button>
        <button onClick={() => setTab('config')} style={navButtonStyle(tab === 'config')}>⚙️ Ajustes</button>
      </nav>

      {/* CONTENEDOR FULL WIDTH: 95% de ancho */}
      <div style={{ padding: '30px', width: '95%', margin: '0 auto' }}>
        
        {tab === 'inicio' && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <ListaClientes />
          </div>
        )}

        {tab === 'clientes' && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
              <FormCliente />
              <FormDireccion />
            </div>
            <ListaDirecciones />
          </div>
        )}

        {tab === 'mascotas' && <div style={{ animation: 'fadeIn 0.5s' }}><ListaMascotas /></div>}
        {tab === 'servicios' && <div style={{ animation: 'fadeIn 0.5s' }}><ListaServicios /></div>}

        {tab === 'clinica' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <FormMascota />
            <RegistroServicio />
          </div>
        )}

        {tab === 'config' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s' }}>
            <CrearServicio />
          </div>
        )}
      </div>

      <footer style={{ textAlign: 'center', padding: '40px', color: '#95a5a6', fontSize: '0.9em' }}>
        © 2026 Sistema Integral Veterinaria | Proyecto de Ingeniería de Sistemas - ITS Libres
      </footer>
    </div>
  );
}

export default App;