import { express } from "express";
import { renderToString } from "vue/server-renderer";
import { createSSRApp } from "vue";

const app = express();

app.get("/", async (req, res) => {});