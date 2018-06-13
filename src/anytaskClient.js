const config = require('config')
const axios = require('axios')
const { format } = require('util')

const axiosInstance = axios.create({
    baseURL: config.get('anytask.urls.base'),
    method: 'GET',

    auth: {
        username: process.env.ANYTASK_LOGIN || config.get('anytask.credentials.login'),
        password: process.env.ANYTASK_PASSWORD || config.get('anytask.credentials.password')
    }
})

const makeRequest = async (options) => {
    console.log(
        'Making %s request to %s %j',
        options.method,
        options.url,
        options.params
    )
    let response = await axiosInstance.request(options)
    console.log('\tSuccess')
    return response.data
}

module.exports.getIssues = (courseId, status = null, add_events = true) => {
    let options = {
        url: format(config.get('anytask.urls.getIssues'), courseId),
        params: {
            status,
            add_events
        }
    }

    return makeRequest(options)
}

module.exports.getIssue = (issueId) => {
    let options = {
        url: format(config.get('anytask.urls.getOrPostIssue'), issueId)
    }

    return makeRequest(options)
}
