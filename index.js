const path = require('path')
global.__appRoot = path.resolve(__dirname)

const main = require('./src')

console.info('Starting app')
main()
