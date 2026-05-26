import express from 'express'
import { renderToString } from "vue/server-renderer";
import { createApp } from "./app.js";

const server = express();

server.get("/", async (request, response) => {
    const app = createApp();

    let initData = null;

    if (app._component.asyncData) {
        initData = await app._component.asyncData();
    }

    renderToString(app).then(html => {
        const htmlStr = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Document</title>
            <script type="importmap">
                {
                    "imports": {
                        "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
                    }
                }
            </script>
            <script type="module" src="/client-entry.js"></script>
            <script>
                window.__INITIAL_DATA__ = ${JSON.stringify(initData)};
            </script>
            <div id="app">${html}</div>
        </body>
        </html>`
        response.send(htmlStr);
    });
});

server.use(express.static("."));

server.listen(3000, () => {

    console.log("Server is running on http://localhost:3000");

});