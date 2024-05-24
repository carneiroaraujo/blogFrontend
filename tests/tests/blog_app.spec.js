const { test, expect, describe, beforeEach } = require("@playwright/test")
const helper = require("./helper")

describe("Blog app", () => {
    beforeEach(async ({ page, request }) => {
        await request.post("/api/testing/reset")
        await request.post("/api/users", {
            data: {
                username: "john",
                password: "john",
                name: "reese",
            }
        })
        await page.goto("/")
    })
    test("Login form is shown", async ({ page }) => {
        await expect(page.getByText("Log in to application")).toBeVisible()

    })

    test("Can successfully login", async ({ page }) => {
        await page.getByTestId("username").fill("john")
        await page.getByTestId("password").fill("john")
        await page.getByRole("button", { name: "login" }).click()
        await expect(page.getByText("reese logged in")).toBeVisible()
    })
    test("Login fails with wrong credentials", async ({ page }) => {
        await page.getByTestId("username").fill("john")
        await page.getByTestId("password").fill("mary")
        await page.getByRole("button", { name: "login" }).click()
        await expect(page.getByText("reese logged in")).not.toBeVisible()
        await expect(page.getByText("wrong username or password")).toBeVisible()
    })
    describe("When logged in", () => {
        beforeEach(async ({ page }) => {
            await page.getByTestId("username").fill("john")
            await page.getByTestId("password").fill("john")
            await page.getByRole("button", { name: "login" }).click()
        })
        test("A new blog can be created", async ({ page }) => {
            await page.getByRole("button", { name: "create new blog" }).click()
            await page.getByTestId("title").fill("title")
            await page.getByTestId("author").fill("author")
            await page.getByTestId("url").fill("url")
            await page.getByRole("button", { name: "create" }).click()

            await expect(page.getByText("new blog added: title")).toBeVisible()
            await expect(page.getByText("title author")).toBeVisible()

        })
        test("Blogs are arranged accordingly to the number of likes", async ({ page }) => {
            const titles = ["first", "second", "third"]

            for (let i = 0; i < 3; i++) {
                await helper.createBlog(page, titles[i], "author", "url")
                const blog = page.getByText(titles[i]+" author").locator("..")
                // page.getby
                await blog.getByRole("button", {name: "view"}).click()
                for (let i1=0; i1<=i; i1++) {
                    await blog.getByText("likes "+(i1)).waitFor()

                    await blog.getByRole("button", {name: "like"}).click()
                    await blog.getByText("likes "+(i1+1)).waitFor()
                }
                await blog.getByRole("button", {name: "hide"}).click()

            }
            await page.pause()
            for (let i=0; i<3; i++) {
                await expect(page.getByText("author view").nth(i).getByText(titles[titles.length-i-1])).toBeVisible()
            }
            await page.pause()
        })
        describe("After a blog is created", () => {
            beforeEach(async ({ page }) => {
                await page.getByRole("button", { name: "create new blog" }).click()
                await page.getByTestId("title").fill("title")
                await page.getByTestId("author").fill("author")
                await page.getByTestId("url").fill("url")
                await page.getByRole("button", { name: "create" }).click()
            })
            test("A blog can be liked", async ({ page }) => {
                await page.getByRole("button", { name: "view" }).click()
                await page.getByRole("button", { name: "like" }).click()
                await expect(page.getByText("likes 1")).toBeVisible()
            })
            test("A blog can be deleted by its owner", async ({ page }) => {
                await page.getByRole("button", { name: "view" }).click()
                page.on("dialog", async dialog => await dialog.accept())
                await page.getByRole("button", { name: "remove" }).click()
                await expect(page.getByText("title author")).not.toBeVisible()
            })
            test("A blog cannot be deleted by other than the owner", async ({ page, request }) => {
                await page.getByRole("button", { "name": "logout" }).click()
                await request.post("/api/users", {
                    data: {
                        username: "mary",
                        password: "mary",
                        name: "josefina",
                    }
                })
                await page.getByTestId("username").fill("mary")
                await page.getByTestId("password").fill("mary")
                await page.getByRole("button", { "name": "login" }).click()
                await page.getByRole("button", { name: "view" }).click()

                expect(page.getByRole("button", { name: "remove" })).not.toBeVisible()
            })
        })


    })
})