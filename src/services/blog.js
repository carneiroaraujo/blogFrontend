import axios from "axios"

const baseUrl = "/api/blogs/"
let token = null
async function getAllBlogs() {
    return (await axios.get(baseUrl)).data
}
async function createBlog(blog) {
    const config = {headers:{Authorization: token}}
    // const blog = {title, author, url}
    console.log(config, blog);
    return (await axios.post(baseUrl, blog, config)).data
}
async function updateBlog(blog) {
    // const config = {headers:{Authorization: token}}
    return (await axios.put(baseUrl+blog.id, blog)).data
}
async function deleteBlog(id) {
    const config = {headers:{Authorization: token}}
    return (await axios.delete(baseUrl+id, config)).data 
}
function setToken(newToken) {
    token = `Bearer ${newToken}`
}


export default {getAllBlogs, createBlog, updateBlog, deleteBlog, setToken}