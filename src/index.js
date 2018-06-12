const config = require('config')
const cronTasks = require('./cron')

const runCronTask = ({ name, cronTime }) => {
    let cronTaskFactory = cronTasks[name]
    if (!cronTaskFactory) {
        console.error('Cron task `%s` not found', name)
        throw new Error('Cron task was not found! Create it or remove from config')
    }

    let cronTask = cronTaskFactory(cronTime)
    cronTask.start()

    if (cronTask.running) {
        console.info('Cron task `%s` started', name)
    } else {
        console.error('Cron task `%s` failed to start!', name)
        throw new Error('Cron task start failed! Fix it or remove task from config')
    }
}

module.exports = () => {
    const cronTasksConfigs = config.get('cron.tasks')

    console.info('%i cron task(s) fetched', cronTasksConfigs.length)
    cronTasksConfigs.forEach(runCronTask)
}
