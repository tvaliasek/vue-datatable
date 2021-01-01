module.exports = {
    chainWebpack: config => {
        config.externals(
            (
                (process.env.NODE_ENV === 'test')
                    ? {}
                    : {
                        'bootstrap-vue': 'bootstrap-vue'
                    })
        )
    }
}
