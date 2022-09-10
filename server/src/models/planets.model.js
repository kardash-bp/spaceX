const fs = require('fs')
const { join } = require('path')
const { parse } = require('csv-parse')
const planets = require('./planets.mongo')

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  )
}

function loadPlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(join(__dirname, '../../data/kepler_data.csv'))
      .pipe(
        parse({
          comment: '#',
          columns: true,
          relax_quotes: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          try {
            await planets.updateOne(
              { keplerName: data.kepler_name },
              { keplerName: data.kepler_name },
              { upsert: true }
            )
          } catch (err) {
            console.error(`Could not save planet ${err}`)
          }
        }
      })
      .on('error', (err) => {
        console.log(err)
        reject(err)
      })
      .on('end', async () => {
        const numberPlanetsFound = (await getAllPlanets()).length
        console.log(`${numberPlanetsFound} habitable planets found!`)
        resolve()
      })
  })
}
async function getAllPlanets() {
  return await planets.find({}, { _id: 0, __v: 0 })
}
module.exports = {
  loadPlanetData,
  getAllPlanets,
}
