const express = require("express");
const helmet = require("helmet");

const healthRoutes = require("./routes/health");
const pasteRoutes = require("./routes/pastes");
const controller = require("./controllers/pasteController");

const app = express();

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Pastebin Lite API is running");
});

app.use("/api", healthRoutes);
app.use("/api/pastes", pasteRoutes);
app.get("/p/:id", controller.renderPaste);

module.exports = app;
