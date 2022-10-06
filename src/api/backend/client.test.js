const http = require('http')
import { Client } from './client'

function getFakeAuth() {
  const mockExpireToken = jest.fn()
  const mockRefreshToken = jest.fn(() => Promise.resolve())
  let fakeAuth = {
    expireToken: mockExpireToken,
    tryRefreshToken: mockRefreshToken,
  }
  return {
    fakeAuth,
    mockExpireToken,
    mockRefreshToken,
  }
}

const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function printExpBackoff(requestTimes) {
  let gaps = []
  let [prev, ...rest] = requestTimes
  rest.forEach((t) => {
    gaps.push(t - prev)
    prev = t
  })
  console.log(gaps)
}

describe('backend server retry handling', () => {
  let server

  afterEach(() => {
    server.close()
  })

  test('happy case', async () => {
    server = http
      .createServer(function (req, res) {
        res.writeHead(200)
        res.end('Hello, World!')
      })
      .listen(8182)
    const { fakeAuth, mockExpireToken, mockRefreshToken } = getFakeAuth()
    const config = {
      baseURL: 'http://localhost:8182',
      timeout: 100,
    }
    const testClient = new Client(fakeAuth, config)
    let resp = await testClient.loadUserData()
    expect(resp.status).toEqual(200)
    expect(mockExpireToken.mock.calls.length).toBe(0)
    expect(mockRefreshToken.mock.calls.length).toBe(0)
    expect(testClient.requestTimes.length).toBe(1)
  })

  it('fails after trying to refresh token on auth error', async () => {
    server = http
      .createServer(function (req, res) {
        res.writeHead(401)
        res.end('Logged out!')
      })
      .listen(8182)
    const { fakeAuth, mockExpireToken, mockRefreshToken } = getFakeAuth()
    const config = {
      baseURL: 'http://localhost:8182',
      timeout: 100,
    }
    const testClient = new Client(fakeAuth, config)
    await expect(testClient.loadUserData()).rejects.toThrow(
      /failed with status code 401/
    )
    expect(mockExpireToken.mock.calls.length).toBe(1)
    expect(mockRefreshToken.mock.calls.length).toBe(1)
    expect(testClient.requestTimes.length).toBe(2)
  })

  it('succeeds when backend gives new token on auth error', async () => {
    let requestCount = 0
    server = http
      .createServer(function (req, res) {
        if (requestCount === 0) {
          requestCount += 1
          res.writeHead(401)
          res.end('Logged out!')
        } else {
          res.writeHead(200)
          res.end('Hello, World!')
        }
      })
      .listen(8182)
    const { fakeAuth, mockExpireToken, mockRefreshToken } = getFakeAuth()
    const config = {
      baseURL: 'http://localhost:8182',
      timeout: 100,
    }
    const testClient = new Client(fakeAuth, config)
    let resp = await testClient.loadUserData()
    expect(resp.status).toEqual(200)
    expect(mockExpireToken.mock.calls.length).toBe(0)
    expect(mockRefreshToken.mock.calls.length).toBe(1)
    expect(testClient.requestTimes.length).toBe(2)
  })

  it('does not retry any other error', async () => {
    server = http
      .createServer(async function (req, res) {
        await snooze(20)
        res.writeHead(200)
        res.end('Hello, World!')
      })
      .listen(8182)
    const { fakeAuth, mockExpireToken, mockRefreshToken } = getFakeAuth()
    const config = {
      baseURL: 'http://localhost:8182',
      timeout: 10,
    }
    const testClient = new Client(fakeAuth, config)
    await expect(testClient.loadUserData()).rejects.toThrow(
      /timeout of 10ms exceeded/
    )
    expect(mockExpireToken.mock.calls.length).toBe(0)
    expect(mockRefreshToken.mock.calls.length).toBe(0)
    expect(testClient.requestTimes.length).toBe(1)
  })

  it('does exponential backoff retries when url is allowlisted', async () => {
    server = http
      .createServer(async function (req, res) {
        await snooze(20)
        res.writeHead(200)
        res.end('Hello, World!')
      })
      .listen(8182)
    const { fakeAuth, mockExpireToken, mockRefreshToken } = getFakeAuth()
    const config = {
      baseURL: 'http://localhost:8182',
      timeout: 10,
      urlsToRetry: ['/users/me'],
      errorRetryInterval: 15,
    }
    const testClient = new Client(fakeAuth, config)
    await expect(testClient.loadUserData()).rejects.toThrow(
      /timeout of 10ms exceeded/
    )
    expect(mockExpireToken.mock.calls.length).toBe(0)
    expect(mockRefreshToken.mock.calls.length).toBe(0)
    expect(testClient.requestTimes.length).toBe(4)
  })

  it('succeeds on third try when doing exponential backoff retries', async () => {
    let requestCount = 0
    server = http
      .createServer(async function (req, res) {
        requestCount += 1
        if (requestCount < 3) {
          await snooze(20)
        }
        res.writeHead(200)
        res.end('Hello, World!')
      })
      .listen(8182)
    const { fakeAuth, mockExpireToken, mockRefreshToken } = getFakeAuth()
    const config = {
      baseURL: 'http://localhost:8182',
      timeout: 10,
      urlsToRetry: ['/users/me'],
      errorRetryInterval: 15,
    }
    const testClient = new Client(fakeAuth, config)
    let resp = await testClient.loadUserData()
    expect(resp.status).toEqual(200)
    expect(mockExpireToken.mock.calls.length).toBe(0)
    expect(mockRefreshToken.mock.calls.length).toBe(0)
    expect(testClient.requestTimes.length).toBe(3)
  })
})
