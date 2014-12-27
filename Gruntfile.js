module.exports = function(grunt){
    grunt.initConfig({
        uglify:{
            app:{
                files: {
                    'dist/yar.min.js':[
                        './src/stringview.js',
                        './src/yar.js'
                    ]
                }
            }
        },
        clean : {
            spm : ['.build','build','dist']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.registerTask('build',['uglify:app'])

};