import axios from 'axios';

const api = axios.create({
    baseURL: 'https://mascotas-examen.onrender.com', // Cambiado de localhost a la URL de Render
});

export default api;