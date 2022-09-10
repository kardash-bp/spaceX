async function httpGetPlanets() {
  const response = await fetch('http://localhost:5000/planets')

  return await response.json()
}

async function httpGetLaunches() {
  const response = await fetch('http://localhost:5000/launches')

  const data = await response.json()

  return data.sort((a, b) => a.flightNumber - b.flightNumber)
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch('http://localhost:5000/launches', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    })
  } catch (err) {
    return {
      ok: false,
    }
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`http://localhost:5000/launches/${id}`, {
      method: 'delete',
    })
  } catch (err) {
    return {
      ok: false,
    }
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch }
