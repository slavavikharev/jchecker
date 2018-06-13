const { NodeVM } = require('vm2')

const vm = new NodeVM({
    console: 'inherit',
    sandbox: {},
    require: {
        external: true,
        builtin: [],
        root: "./",
        mock: {
            process: {
                argv: ['', 'aaabbc']
            }
        }
    }
})

module.exports = async (fileBody) => {
    try {
        return await vm.run(fileBody)
    } catch (err) {
        console.error('Cannot run script')
        console.error('\t', err)
    }
}
