import axios from 'axios';

export const placeGuestOrder = (guestInfo: any) =>
  axios.post('http://localhost:5000/order/add/-1', { guest_info: guestInfo });