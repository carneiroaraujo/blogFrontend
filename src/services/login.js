import axios from "axios"

const baseUrl = "/api/login/"

async function login(credentials) {
    return (await axios.post(baseUrl, credentials)).data
}


export default {login}