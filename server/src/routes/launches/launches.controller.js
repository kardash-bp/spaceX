const {
  getAllLaunches,
  addNewLaunch,
  launchExists,
  abortLaunch,
} = require('../../models/launches.model')
const pagination = require('../../utils/pagination')

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = pagination(req.query)
  const data = await getAllLaunches(skip, limit)
  return res.status(200).json(data)
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: 'Missing required launch data.',
    })
  }

  launch.launchDate = new Date(launch.launchDate)
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date',
    })
  }

  await addNewLaunch(launch)
  return res.status(201).json(launch)
}

async function httpDeleteLaunch(req, res) {
  const launchId = +req.params.id
  if (!(await launchExists(launchId))) {
    return res.status(404).json({ error: 'Launch not found!' })
  }
  const aborted = await abortLaunch(launchId)
  console.log(aborted)
  return res.status(200).json(aborted)
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpDeleteLaunch }
