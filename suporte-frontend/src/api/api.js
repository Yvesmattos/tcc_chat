import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const login = (username, password) =>
  axios.post(`${API_URL}/auth/login`, { username, password });

export const getChats = (token) =>
  axios.get(`${API_URL}/support/chats`, { headers: { Authorization: token } });

export const respondToChat = (token, chatId, response) =>
  axios.post(`${API_URL}/support/respond/${chatId}`, { response }, { headers: { Authorization: token } });
