const http = require('http')
const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '.env') })
}
require('./db')
const app = require('./app')
const { loadLaunchesData } = require('./models/launches.model')
const { loadPlanetData } = require('./models/planets.model')

const PORT = process.env.PORT | 5000
const server = http.createServer(app)

async function startServer() {
  await loadPlanetData()
  await loadLaunchesData()

  server.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT}`)
  })
}
startServer()
