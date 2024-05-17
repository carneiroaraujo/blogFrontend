import axios from "axios"

const baseUrl = "/api/blogs/"
let token = null
async function getAllBlogs() {
    return (await axios.get(baseUrl)).data
}
async function createBlog(title, author, url) {
    const config = {headers:{Authorization: token}}
    const blog = {title, author, url}
    console.log(config);
    return (await axios.post(baseUrl, blog, config)).data
}
function setToken(newToken) {
    token = `Bearer ${newToken}`
}


export default {getAllBlogs, createBlog, setToken}