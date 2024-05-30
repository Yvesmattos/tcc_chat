import axios from "axios";
const API_URL = 'http://localhost:5000';

export function sendQuestion(question) {
    let obj = {
        "pergunta" : question,
        "engine": 2
    }
    return axios.post(`${API_URL}/send_question`, obj)
}