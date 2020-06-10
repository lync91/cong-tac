module.exports = {
	less: {
        files: {
          'src/css/app.css': [
            'src/css/less/app.less'
          ]
        },
        options: {
          compile: true
        }
    },
    angular: {
        files: {
            'angular/css/app.min.css': [
                'node_modules/bootstrap/dist/css/bootstrap.css',
                'node_modules/animate.css/animate.css',
                'node_modules/font-awesome/css/font-awesome.css',
                'node_modules/simple-line-icons/css/simple-line-icons.css',
                'src/css/*.css'
            ]
        },
        options: {
            compress: true
        }
    },
    html: {
        files: {
            'html/css/app.min.css': [
                'node_modules/bootstrap/dist/css/bootstrap.css',
                'node_modules/animate.css/animate.css',
                'node_modules/font-awesome/css/font-awesome.css',
                'node_modules/simple-line-icons/css/simple-line-icons.css',
                'src/css/*.css'
            ]
        },
        options: {
            compress: true
        }
    }
}
