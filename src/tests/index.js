const axios = require('axios')

const entropy = require('./entropy')
const huffman = require('./huffman')

const testingTasks = {
    entropy,
    huffman
}

const getFileUrl = (issueId, eventFiles) => {
    if (eventFiles.length === 1) {
        console.log('There is only one file for issue with id=%i, so use it', issueId)

        return eventFiles[0].url
    } else if (eventFiles.length > 1) {
        console.log('There are many files for issue with id=%i, try to find index', issueId)

        let indexFile = eventFiles
            .filter(({ name }) => name.startsWith('index.'))
            .slice(-1)
            .pop()

        return indexFile ? indexFile.url : null
    }

    console.log('There were no files in event for issue with id=%i', issueId)
    return null
}

const fetchFile = async (url) => {
    try {
        console.log('Trying to fetch file from %s', url)
        let data = await axios.get(url)
        console.log('Success')
        return data.data
    } catch (err) {
        console.error('Cannot fetch file by url %s', url)
        console.error('\t', err)
        return null
    }
}

module.exports.testIssue = async ({ id, taskName, latestEvent }) => {
    let testingTask = testingTasks[taskName]
    if (!testingTask) {
        console.error('Tests for task `%s` not found', taskName)
        return
    }

    let fileUrl = getFileUrl(id, latestEvent.files)
    if (!fileUrl) {
        return 'Cannot find index file, so do nothing'
    }

    let fileBody = await fetchFile(fileUrl)
    if (!fileBody) {
        return 'Cannot fetch file'
    }

    return await testingTask(fileBody)
}
