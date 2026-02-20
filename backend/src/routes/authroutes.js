const express = require("express");
const authrouter = express.Router();
const login  = require("../controllers/authcontroller");

// POST /api/auth/login
authrouter.post("/login", login);

module.exports = authrouter;