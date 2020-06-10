module.exports = {
  angular:{
    src:[
      'angular/js/app.src.js'
    ],
    dest:'angular/js/app.min.js',
  },
  html:{
    src:[
      'html/js/app.src.js'
    ],
    dest:'html/js/app.min.js'
  },
  module: {
    expand: true,
    cwd: 'src/module',
    src: '**/*.js',
    dest: 'src/module'
  }
}
