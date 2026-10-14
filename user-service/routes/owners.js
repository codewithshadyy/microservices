
const express = require("express")
const router = express.Router()

const {register} = require("../controllers/ownerController.js")

router.post("/register", register)



module.exports = router