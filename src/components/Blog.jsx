import { useState } from "react"

function Blog({ blog, isOwned, onLikeIncrement, onRemove }) {
    const [showDetails, setShowDetails] = useState(false)
    function handleLike() {
        const newBlog = {...blog, likes:blog.likes+1}
        // console.log(blog);
        onLikeIncrement(newBlog)
    }
    function handleRemove() {
        onRemove(blog) 
    }

    return (

        <div className="blog">
            <div>
                {blog.title} {blog.author} <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? "hide" : "view"}
                </button>
            

            </div>
            <div style={{ display: showDetails ? "" : "none" }}>
                {blog.url} <br />
                likes {blog.likes} <button onClick={handleLike}>like</button> <br />
                {blog.user.name} <br />

                {isOwned
                ? <button onClick={handleRemove}>remove</button>
                : null
                }
            </div>

        </div>
    )
}

export default Blog