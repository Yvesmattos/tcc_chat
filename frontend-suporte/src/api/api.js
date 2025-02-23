import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL_BACKEND

console.log(API_URL)

export const login = (username, password) =>
  axios.post(`${API_URL}/api/auth/login`, { username, password });

export const getChats = (token) =>
  axios.get(`${API_URL}/api/support/chats`, { headers: { Authorization: token } });

export const respondToChat = (token, chatId, response) =>
  axios.post(`${API_URL}/api/support/respond/${chatId}`, { response }, { headers: { Authorization: token } });
