import axios from "axios";

const clienteAxios = axios.create({
    baseURL: 'https://uptask-mern-back.onrender.com/api'
})

export default clienteAxios;