import { useEffect, useState } from 'react'
import loginService from "./services/login"
import blogService from "./services/blog"
import Notification from "./components/Notification"
import Toggable from "./components/Toggable"
import BlogForm from "./components/BlogForm"
import Blog from "./components/Blog"


import './App.css'
function App() {
  // const [count, setCount] = useState(0)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

  const [notification, setNotification] = useState(null)
  const [notificationClass, setNotificationClass] = useState("success")

  async function handleLoginSubmit(event) {
    event.preventDefault()
    // console.log("login", username, password);
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem("blogAppLoggedUser", JSON.stringify(user))
    } catch {
      notificate("wrong username or password", "error")
    }

  }
  async function createBlog(blog) {

    try {
      const newBlog = await blogService.createBlog(blog)
      console.log(newBlog);
      setBlogs(blogs.concat(newBlog))
      notificate(`new blog added: ${newBlog.title}`, "success")
    } catch { }
  }
  async function updateBlog(blog) {
    // console.log(blog);
    const updatedBlog = await blogService.updateBlog(blog)
    setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))

  }
  async function deleteBlog(blog) {
    const id = blog.id
    if (window.confirm("Remove blog " + blog.title)) {
      try {
        await blogService.deleteBlog(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
      } catch { }
    }


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
      // console.log(user);
      setUser(user)
    }
  }, [])
  useEffect(() => {
    async function fetchData() {
      setBlogs(await blogService.getAllBlogs())
      // console.log(blogs);
    }
    fetchData()

  }, [])

  function BlogList() {
    return (
      <>
        <h2>blogs</h2>
        <Notification message={notification} type={notificationClass} />
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

        <Toggable buttonLabel="create new blog">
          <BlogForm onSubmit={createBlog} />

        </Toggable>
        {
          blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                onLikeIncrement={updateBlog}
                onRemove={deleteBlog}
                isOwned={blog.user.id === user.id} />
            )
        }
      </>
    )
  }
  function LoginForm() {
    return (
      <>
        <h2>Log in to application</h2>
        <Notification message={notification} type={notificationClass} />
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
