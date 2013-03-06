module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'js/jquery.behaviorminer.js',
                'js/behaviors/*.js',
                'js/connectors/*.js'
            ]
        },
        concat : {
            options: {
              separator: ''
            },
            dist: {
              src: ['js/jquery.behaviorminer.js', 'js/behaviors/*.js'],
              dest: 'js/dist/jquery.behaviorminer.full.js'
            }
        },
        uglify: {
            target: {
              files: {
                'js/dist/jquery.behaviorminer.min.js': ['js/jquery.behaviorminer.js', 'js/behaviors/*.js']
            }
        }
  }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', [
        'jshint',
        'concat',
        'uglify'
    ]);

    grunt.registerTask('default', ['build']);

};