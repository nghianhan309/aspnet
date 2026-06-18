import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7226', // ASP.NET Core Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
