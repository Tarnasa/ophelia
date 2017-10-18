'use strict'

const express = require('express')
const _ = require('lodash')
const router = express.Router()
const teams = require('../db/init').teams

// All paths in this file should start with this
const path = '/users'

/**
 * Gets a list of all usernames
 * Response body format:
 * {
*     Success: Boolean,
*     users: [String]
* }
 * Response codes:
 * 200 - Successfully retrieved
 * 500 - Something went wrong
 */
router.get(path + '/', (req, res) => {
  const response = {
    success: false,
    users: []
  }

  teams.getAllTeamNames().then((data) => {
    response.success = true
    response.users = data
    res.status(200).json(response)
  }, (err) => {
    res.status(500).json(response)
  }).catch(() => {
    res.status(500).json(response)
  })
})

/**
 * Creates a user
 * Request body format:
 * {
*     username: String,
*     password: String,
*     email: String
* }
 * Response body format:
 * {
*     success: Boolean, - true if success, false otherwise
*     message: String - error message/success message
* }
 * Response codes:
 * 201 - Successfully created
 * 400 - User error
 * 500 - Something went wrong
 */
router.post(path + '/', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const userData = req.body
  // Checking for required values
  if (!userData.username) {
    response.message = 'Required field username is missing or blank'
    res.status(400).json(response)
  } else if (!userData.email) {
    response.message = 'Required field email is missing or blank'
    res.status(400).json(response)
  } else if (!userData.password) {
    response.message = 'Required field password is missing or blank'
    res.status(400).json(response)
  }
  // TODO: encrypt passwords
  teams.createTeam(userData.username, userData.email, userData.password, true).then(() => {
    response.success = true
    response.message = 'Created user successfully'
    res.status(201).json(response)
  }, (err) => {
    response.message = err.message
    res.status(400).json(response)
  }).catch((err) => {
    response.message = err.message
    res.status(400).json(response)
  })
})

router.get(path + '/:teamName', (req, res) => {
  const response = {
    success: false,
    message: '',
    user: null

  }
  // TODO check if user is authorized
  teams.getTeamByName(req.params.teamName).then((data) => {
    if (data.length === 0) {
      response.success = false;
      response.message = 'This team does not exist'
      return res.status(404).json(response)
    }
    response.success = true
    response.message = 'Success'
    response.user = {
      name: data[0].name,
      contactEmail: data[0].contact_email,
      isEligible: data[0].is_eligible
    }

    return res.status(200).json(response)
  }, (err) => {
    response.success = false
    response.message = err.message
    return res.status(500).json(response)
  }).catch((err) => {
    response.success = false
    response.message = err.message
    return res.status(500).json(response)
  })
})

router.put(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

module.exports = {router}
