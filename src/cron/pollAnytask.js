const config = require('config')
const cron = require('cron')

const anytaskClient = require('../anytaskClient')
const { issuesDatastore } = require('../database')
const { testIssue } = require('../tests')

const issuesMapper = ({ id, courseId, task, student, events }) => {
    let courseConfig = config.get('anytask.courses')[courseId]
    if (!courseConfig) {
        console.warn('There is no such course known with id=%i', courseId)
        console.warn('\tAdd it to config')
        return null
    }

    let taskName = courseConfig.tasks[task.id]
    if (!taskName) {
        console.warn('Unknown task with id=%i for course with id=%i', id, courseId)
        console.warn('\tAdd it to config')
        return null
    }

    let studentUsername = student.username

    let latestEvent = events
        .filter(({ author }) => author.username === studentUsername)
        .filter(({ files }) => files.length > 0)
        .slice(-1)
        .pop()

    if (!latestEvent) {
        console.log('There is no student submissions for issue with id=%i', id)
        return null
    }

    return {
        id: id,
        taskName: taskName,
        latestEvent: {
            files: latestEvent.files,
            timestamp: latestEvent.timestamp
        }
    }
}

const checkIssue = async ({ id,  taskName, latestEvent }) => {
    let existingIssue = await issuesDatastore.findOne({ _id: id })

    if (!existingIssue) {
        // Cold start - do not test old solutions
        console.info('Here is new issue with id=%i', id)
        try {
            console.info('\tTrying to insert into database')
            await issuesDatastore.insert({ _id: id, updatedAt: latestEvent.timestamp })
            console.info('\tSuccess')
        } catch (err) {
            console.info('\tCannot insert issue into database')
            console.error(err)
        } finally {
            return
        }
    }

    // if (latestEvent.timestamp === existingIssue.updatedAt) {
    //     console.log('Found existing not updated issue with id=%i', id)
    //     return
    // }

    console.info('Here is updated issue with id=%i', id)
    console.log(testIssue({ id, taskName, latestEvent }))
}

const pollCourse = async ({ courseId, pollingStatus }) => {
    let issues = null

    try {
        issues = await anytaskClient.getIssues(courseId, pollingStatus)
    } catch (err) {
        console.error('Cannot poll course with id=%i', courseId)
        console.error('\t', err)
        return
    }

    issues
        .map(issue => issuesMapper({ courseId, ...issue }))
        .filter(issue => issue !== null)
        .forEach(checkIssue)
}

const pollAnytask = async () => {
    let coursesConfigs = config.get('anytask.courses')
    let coursesIds = Object.keys(coursesConfigs)

    console.info('Start to poll anytask')
    coursesIds.forEach(courseId => {
        pollCourse({
            courseId,
            ...coursesConfigs[courseId]
        })
    })
}

// module.exports = (cronTime) => {
//     return new cron.CronJob({
//         cronTime: cronTime,
//         start: false,
//         timeZone: config.get('timezone'),
//         onTick: pollAnytask
//     })
// }

module.exports = pollAnytask
