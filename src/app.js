const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const authrouter=require("./routes/authroutes")
const cookieParser = require("cookie-parser");
const userrouter=require("../src/routes/userroutes")
const driveroutes=require("../src/routes/driveroutes")


app.use(cookieParser());
app.use(cors());
app.use(express.json());


//Routes Usage
app.use("/api/auth",authrouter);
app.use("/api/user",userrouter)
app.use("/api/drive",driveroutes)
app.use("/api/application",require("./routes/applicationroutes"))
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/admin",require("./routes/adminroutes"))
app.use("/api/benchmark", require("./routes/benchmark.routes"));
app.use("/api/skill-gap", require("./routes/skillgap.routes"));
app.use("/api/ai", require("./routes/chatbot.routes"));
app.use("/api/resume", require("./routes/resume.rotes"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(express.static(path.join(__dirname, "../public")));

module.exports = app;