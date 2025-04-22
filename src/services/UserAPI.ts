import axios from 'axios';

export const addGuestUser = (data: any) => axios.post('http://localhost:5000/user/add', data);