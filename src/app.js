const express = require('express')
require('./db/mongoose')
const app = express()
const hbs = require('hbs')
const path = require('path')
const userRouter = require('./routers/user')

const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static(publicDir))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(userRouter)


module.exports = app