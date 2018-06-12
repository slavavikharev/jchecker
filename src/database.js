const config = require('config')
const Datastore = require('nedb-promise')
const path = require('path')

module.exports.issuesDatastore = new Datastore({
    filename: path.join(__appRoot, config.get('database.issues.path')),
    autoload: true
})
