import express from "express";
import { renderToString } from "vue/server-renderer";
import { createSSRApp } from "vue";

const app = express();
/**
 *   如果只创建了一个vue的单例对象，它将被每次发来的请求共享，这是不符合实际实际需求的，因此我们需要为每个请求重新生成一个vue实例，避免相互影响
 *  @param {*} msg
 */
function createApp(msg) {
    const app = createSSRApp({
        data() {
            return {
                msg
            }
        },
        template: `<div>${msg}</div>`
    })

    return app;
}

function getHtmlStrWrap(contentStr, title) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body>
        <h3><a href="/home">Home Page</a></h3>
        <h3><a href="/about">About Page</a></h3>
        <h3><a href="/test">Error Path</a></h3>
        <div id="app">${contentStr}</div>
    </body>
    </html>`
}

// Home Page
app.get("/home", async (request, response) => {
    const vueStr = await renderToString(createApp("Home Page"));
    const htmlStr = getHtmlStrWrap(vueStr, "Home Page");
    response.send(htmlStr);
})

app.get("/about", async (request, response) => {
    const vueStr = await renderToString(createApp("About Page"));
    const htmlStr = getHtmlStrWrap(vueStr, "About Page");
    response.send(htmlStr);
})

app.get("/{*path}", async (request, response) => {
    const vueStr = await renderToString(createApp("404 Page"));
    const htmlStr = getHtmlStrWrap(vueStr, "404 Page");
    response.send(htmlStr);
})

app.listen(3000, () => {

    console.log("server is running at http://localhost:3000");

})