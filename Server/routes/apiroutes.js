const express = require('express')
const route = express.Router()

route.get('/', (req, res) => {
    res.json({ msg: "Server is Live" })
})



module.exports = route;