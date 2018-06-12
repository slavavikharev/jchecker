const config = require('config')
const axios = require('axios')
const url = require('url')
const { format } = require('util')

const baseOptions = {
    baseURL: config.get('anytask.urls.base'),
    method: 'GET',

    auth: {
        username: process.env.ANYTASK_LOGIN || config.get('anytask.credentials.login'),
        password: process.env.ANYTASK_PASSWORD || config.get('anytask.credentials.password')
    }
}

const makeRequest = async (options) => {
    options = { ...baseOptions, ...options }
    console.log(
        'Making %s request to %s %j',
        options.method,
        url.resolve(options.baseURL, options.url),
        options.params
    )
    let response = await axios.request(options)
    console.log('\tSuccess')
    return response.data
}

module.exports.getIssues = async (courseId, status = null, add_events = true) => {
    let options = {
        url: format(config.get('anytask.urls.getIssues'), courseId),
        params: {
            status,
            add_events
        }
    }

    return await makeRequest(options)
}

module.exports.getIssue = async (issueId) => {
    let options = {
        url: format(config.get('anytask.urls.getOrPostIssue'), issueId)
    }

    return await makeRequest(options)
}
