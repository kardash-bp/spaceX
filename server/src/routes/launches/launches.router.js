const { Router } = require('express')
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpDeleteLaunch,
} = require('./launches.controller')

const launchesRouter = Router()

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpAddNewLaunch)
launchesRouter.delete('/:id', httpDeleteLaunch)

module.exports = launchesRouter
