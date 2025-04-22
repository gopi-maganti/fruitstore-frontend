import axios from 'axios';

export const fetchFruits = () => axios.get('http://localhost:5000/fruit/');