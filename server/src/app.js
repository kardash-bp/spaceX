const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const planetsRouter = require('./routes/planets/planets.router')
const launchesRouter = require('./routes/launches/launches.router')
const app = express()
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(compression())
app.use(morgan('short'))

app.use(express.json())
app.use(express.static('build'))
app.use('/v1/planets', planetsRouter)
app.use('/v1/launches', launchesRouter)

app.get('/*', (req, res) => {
  res.sendFile('index.html')
})
module.exports = app
