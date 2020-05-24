const BASE_URL = 'http://localhost:3000'

const SessionApi = {
  postLogIn: (body: { userName: string, password: string }) => {
    const options: RequestInit = {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(body),
      method: 'POST',
    }
    return fetch(`${BASE_URL}/api/login`, options)
      .then(res => res.json())
      .then(data => {
        return data
      })
      .catch(console.error)
  },
  postLogOut: () => {
    const options: RequestInit = {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({}),
      method: 'POST',
    }
    return fetch(`${BASE_URL}/api/logout`, options)
      .then(res => res.json())
      .then(data => {
        return data
      })
      .catch(console.error)
  },
  postSignUp: (body: { userName: string, password: string }) => {
    const options: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
      method: 'POST',
    }
    return fetch(`${BASE_URL}/api/sign-up`, options)
      .then(res => res.json())
      .then(data => {
        return data
      })
      .catch(console.error)
  },
  getSessionValidation: () => {
    const options: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method: 'GET',
    }
    return fetch(`${BASE_URL}/api/validate`, options)
      .then(res => res.json())
      .then(data => {
        return data
      })
      .catch(console.error)
  }
}

export default SessionApi
