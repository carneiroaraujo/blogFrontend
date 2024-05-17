import { useEffect, useState } from 'react'
import loginService from "./services/login"
import blogService from "./services/blog"
import Notification from "./components/Notification"

import './App.css'
function App() {
  // const [count, setCount] = useState(0)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

  const [newTitle, setNewTitle] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [newUrl, setNewUrl] = useState("")

  const [notification, setNotification] = useState(null)
  const [notificationClass, setNotificationClass] = useState("success")

  async function handleLoginSubmit(event) {
    event.preventDefault()
    // console.log("login", username, password);
    try{
      const user = await loginService.login({ username, password })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem("blogAppLoggedUser", JSON.stringify(user))  
    } catch {
      notificate("wrong username or password", "error")
    }
    
  }
  async function handleBlogSubmit(event) {
    event.preventDefault()
    try{
      const newBlog = await blogService.createBlog(newTitle, newAuthor, newUrl)
      setBlogs(blogs.concat(newBlog))
      notificate(`new blog added: ${newBlog.title}`, "success")  
    } catch {}
  }
  function notificate(message, type) {
    setNotification(message)
    setNotificationClass(type)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }
  function handleLogout(event) {
    event.preventDefault()
    window.localStorage.removeItem("blogAppLoggedUser")
    setUser(null)
  }

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("blogAppLoggedUser")
    if (loggedUser) {
      const user = JSON.parse(loggedUser) 
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])
  useEffect(() => {
    async function fetchData() {
      setBlogs(await blogService.getAllBlogs())
    }
    fetchData()

  }, [])

  function BlogList() {
    return (
      <>
        <h2>blogs</h2>
        <Notification message={notification} type={notificationClass}/>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

        <div>
          <h2>create new</h2>
          <form onSubmit={handleBlogSubmit}>
            <div>
              title: <input type="text" value={newTitle} onChange={({target})=>setNewTitle(target.value)}/>
            </div>
            <div>
              author: <input type="text" value={newAuthor} onChange={({target})=>setNewAuthor(target.value)}/>
            </div>
            <div>
              url: <input type="text" value={newUrl} onChange={({target})=>setNewUrl(target.value)}/>
            </div>
            <button type="submit">create</button>
          </form>
        </div>

        {
          blogs.map(blog =>
            <p key={blog.id}>{blog.title}</p>
          )
        }
      </>
    )
  }
  function LoginForm() {
    return (
      <>
        <h2>Log in to application</h2>
        <Notification message={notification} type={notificationClass}/>
        <form onSubmit={handleLoginSubmit}>
          <div>
            username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input type="text" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type='submit'>login</button>
        </form>
      </>
    )
  }
  return (
    <>
      
      {
        user === null
          ? LoginForm()
          : BlogList()
      }
    </>
  )
}

export default App
