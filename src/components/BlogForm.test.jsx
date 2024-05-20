import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
test("form properly submits the details of a new blog created", async () => {
    const handler = vi.fn()
    const container = render(<BlogForm onSubmit={handler}/>)
    const user = userEvent.setup()
   
    await user.type( container.container.querySelector("#title"), "title")
    await user.type( container.container.querySelector("#author"), "author")
    await user.type( container.container.querySelector("#url"), "url")

    const button = container.getByText("create")
    await user.click(button)
    expect(handler.mock.calls).toHaveLength(1)
    expect(handler.mock.calls[0][0]).toStrictEqual({title:"title", author:"author", url:"url"})


})