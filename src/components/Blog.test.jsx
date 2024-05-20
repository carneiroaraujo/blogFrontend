import userEvent from "@testing-library/user-event";
import { screen,  render } from "@testing-library/react";
import Blog from "./Blog";
import { beforeEach } from "vitest";

describe("Blog", () => {
    let container
    const blog = {
        title:"title", 
        author:"author",
        user: {
            name: "john"
        },
        likes: 10,
        url: "url"
    }
    const handler = vi.fn()

    beforeEach(() => {
        container = render(<Blog blog={blog} onLikeIncrement={handler}/>).container
    })

    test("renders only the blog's title and author by default", async () => {
        const head = container.querySelector(".head")
        expect(head).toHaveTextContent(blog.title+" "+blog.author)
    })
    test("renders additional information when expanded", async () => {
        const user =userEvent.setup()
        const button = screen.getByText("view")
        await user.click(button)

        const body = container.querySelector(".body")
        expect(body)
            .toHaveTextContent(blog.url)
            .toHaveTextContent("likes")
            .toHaveTextContent(blog.likes)
            .toHaveTextContent(blog.user.name)

    })
    test("like function is properly called", async () =>{
        const user =userEvent.setup()
        const button = screen.getByText("view")
        await user.click(button)
        const likeButton = screen.getByText("like")
        await user.click(likeButton)
        await user.click(likeButton)

        expect(handler.mock.calls).toHaveLength(2)

    })
    
})
