import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { jsPDF } from 'jspdf'; // IMPORTANTE: Con llaves { } para evitar el error de tu captura
import 'jspdf-autotable';

const HistorialMascota = ({ idMascota, nombreMascota, onClose }) => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. Cargar datos del historial desde el Backend (IntelliJ)
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const res = await api.get('/mascota-servicio');
        const data = Array.isArray(res.data) ? res.data : [];
        // Filtramos para que solo salgan los servicios de la mascota abierta (como Max)
        const filtrado = data.filter(h => h.mascota && h.mascota.idMascota === idMascota);
        setHistorial(filtrado);
      } catch (err) {
        console.error("Error al conectar con el servidor:", err);
      } finally {
        setCargando(false);
      }
    };
    if (idMascota) cargarHistorial();
  }, [idMascota]);

  // 2. Función Maestra para generar el PDF (Corregida)
  const generarPDF = () => {
    try {
      // Creamos la instancia del documento
      const doc = new jsPDF();
      
      // Diseño del Encabezado
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(52, 152, 219); // Azul profesional
      doc.text("SISTEMA INTEGRAL VETERINARIO", 105, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`EXPEDIENTE CLÍNICO: ${nombreMascota.toUpperCase()}`, 20, 35);
      
      doc.setFontSize(10);
      doc.text(`Fecha del Reporte: ${new Date().toLocaleDateString()}`, 20, 42);
      doc.line(20, 45, 190, 45); // Línea divisoria

      // Mapeo de datos para la tabla
      const columnas = ["FECHA", "SERVICIO REALIZADO", "OBSERVACIONES / NOTAS"];
      const filas = historial.map(h => [
        new Date(h.fecha).toLocaleDateString(),
        h.servicio?.descripcion || "General",
        h.nota || "Sin observaciones adicionales"
      ]);

      // Generar la tabla automática
      doc.autoTable({
        startY: 50,
        head: [columnas],
        body: filas,
        theme: 'striped',
        headStyles: { fillColor: [52, 152, 219], textColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 4 },
        margin: { left: 20, right: 20 }
      });

      // Pie de página institucional
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Documento generado por el Proyecto de Ingeniería de Sistemas - ITS Libres", 105, 285, { align: 'center' });

      // Acción de descarga
      doc.save(`Historial_${nombreMascota}.pdf`);
      
    } catch (error) {
      console.error("Error técnico al generar el PDF:", error);
      alert("Error: Revisa que jspdf esté bien instalado en tu proyecto.");
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '80%', maxWidth: '850px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #3498db', paddingBottom: '15px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>📋 Historial: {nombreMascota}</h2>
          <div>
            <button 
              onClick={generarPDF} 
              style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}
            >
              📥 Descargar Reporte
            </button>
            <button 
              onClick={onClose} 
              style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Cerrar
            </button>
          </div>
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {cargando ? <p>Consultando historial...</p> : historial.length === 0 ? <p>No hay registros médicos para esta mascota.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px' }}>Fecha</th>
                  <th style={{ padding: '12px' }}>Servicio</th>
                  <th style={{ padding: '12px' }}>Notas</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{new Date(h.fecha).toLocaleDateString()}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{h.servicio?.descripcion}</td>
                    <td style={{ padding: '12px' }}>{h.nota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialMascota;