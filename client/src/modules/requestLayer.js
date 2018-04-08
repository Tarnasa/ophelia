import axios from 'axios'

import stores from '../stores'
import { history } from '../index'

axios.interceptors.response.use(
  response => response,
  error => {
    // TODO: Add all error logging logic here
    if (error.response.status === 401) {
      stores.authStore.logUserOut()
      history.push('/login')
    }
    return Promise.reject(error)
  }
)

axios.interceptors.request.use(
  config => {
    if (stores.authStore && stores.authStore.token) {
      config.headers.Authorization = `Bearer ${stores.authStore.token}`
    }

    return config
  },
  error => Promise.reject(error)
)

export default class RequestLayer {
  fetchGames (pageNum, pageSize) {
    return new Promise((resolve, reject) => {
      // Check first to make sure the user is logged in
      if (!stores.authStore.isUserLoggedIn) {
        return reject(new Error('User must be logged in to fetch games'))
      }
      axios.get(process.env.REACT_APP_API_URL + '/games/', {
        headers: {
          Authorization: `Bearer ${stores.authStore.token}`
        },
        params: {
          page: pageNum,
          pageSize: pageSize
        }
      }).then((response) => {
        // This query also gives us the number of pages, so we need to grab both.
        return resolve({
          games: response.data.games,
          numPages: response.data.pages
        })
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  fetchSubmissions () {
    return new Promise((resolve, reject) => {
      // Check first to make sure the user is logged in
      if (!stores.authStore.isUserLoggedIn) {
        return reject(new Error('User must be logged in to fetch submissions'))
      }
      axios.get(process.env.REACT_APP_API_URL + '/submissions/', {
        headers: {
          Authorization: `Bearer ${stores.authStore.token}`
        }
      }).then((response) => {
        return resolve(response.data.submissions)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  uploadSubmissions (file) {
    return new Promise((resolve, reject) => {
      if (!stores.authStore.isUserLoggedIn) {
        return reject(new Error('User must be logged in to upload submissions'))
      }
      let formData = new FormData()
      formData.append('file', file)
      axios.post(process.env.REACT_APP_API_URL + '/submissions/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${stores.authStore.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  async getCurrentUser () {
    try {
      return axios.get(`${process.env.REACT_APP_API_URL}/users/${stores.authStore.userId}`)
    } catch (err) {
      throw err
    }
  }

  async getTeamById (teamId) {
    try {
      return axios.get(`${process.env.REACT_APP_API_URL}/users/${teamId}`)
    } catch (err) {
      throw err
    }
  }

  async updateUserProfile (oldPassword, email, name, password) {
    const { authStore } = stores
    if (!authStore.isUserLoggedIn) {
      throw new Error('Must be logged in to do that!')
    }
    try {
      return axios.put(`${process.env.REACT_APP_API_URL}/users/${authStore.username}/`, {
        oldPassword,
        editData: {
          email,
          name,
          password
        }
      })
    } catch (err) {
      throw err
    }
  }
}
