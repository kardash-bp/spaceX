const Launches = require('./launches.mongo')
const Planets = require('./planets.mongo')
const axios = require('axios')
async function getLatestFlightNumber() {
  const latestLaunch = await Launches.findOne().sort('-flightNumber')
  if (!latestLaunch?.flightNumber) return 100
  return latestLaunch.flightNumber
}
async function getAllLaunches(skip, limit) {
  return await Launches.find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit)
}

async function saveLaunch(launch) {
  try {
    await Launches.updateOne({ flightNumber: launch.flightNumber }, launch, {
      upsert: true,
    })
  } catch (err) {
    console.error(`Could not save launch ${err}`)
  }
}

async function addNewLaunch(launch) {
  const planet = await Planets.findOneAndUpdate({ keplerName: launch.target })
  if (!planet) {
    throw new Error('No matching planet found.')
  }
  const num = (await getLatestFlightNumber()) + 1
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['NASA', 'ASD'],
    flightNumber: num,
  })
  await saveLaunch(newLaunch)
}
async function launchExists(launchId) {
  return await Launches.findOne({ flightNumber: launchId })
}
async function abortLaunch(launchId) {
  return await Launches.findOneAndUpdate(
    { flightNumber: launchId },
    { upcoming: false, success: false },
    { new: true }
  )
}
async function loadLaunchesData() {
  const lfn = await getLatestFlightNumber()
  if (lfn > 102) return
  const { data } = await axios.post(
    'https://api.spacexdata.com/v5/launches/query',
    {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: 'rocket',
            select: {
              name: 1,
            },
          },
          {
            path: 'payloads',
            select: {
              customers: 1,
            },
          },
        ],
      },
    }
  )
  if (!data) {
    console.log('Problem downloading launches')
    throw new Error('Launch data download fail.')
  }
  const launchDocs = data.docs
  for (const doc of launchDocs) {
    const payloads = doc['payloads']
    const customers = payloads.flatMap((payload) => {
      return payload['customers']
    })
    const launch = {
      flightNumber: doc['flight_number'],
      mission: doc['name'],
      rocket: doc['rocket']['name'],
      launchDate: doc['date_local'],
      upcoming: Date.now() > new Date(doc['date_local']) ? false : true,
      success: doc['success'],
      customers,
    }
    await saveLaunch(launch)
  }
}
module.exports = {
  getAllLaunches,
  addNewLaunch,
  launchExists,
  abortLaunch,
  loadLaunchesData,
}
