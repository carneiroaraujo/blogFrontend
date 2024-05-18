import { useState } from "react"

function BlogForm({onSubmit}) {
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [url, setUrl] = useState("")

    function handleBlogSubmit(event) {
        event.preventDefault()
        console.log(title, author, url);
        onSubmit({title, author, url})
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleBlogSubmit}>
                <div>
                    title: <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
                </div>
                <div>
                    author: <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
                </div>
                <div>
                    url: <input type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}


export default BlogForm
