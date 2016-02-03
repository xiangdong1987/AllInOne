module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      },
      buildall: {//任务三：按原文件结构压缩js文件夹内所有JS文件
          files: [{
              expand:true,
              cwd:'src',//js目录下
              src:'**/*.js',//所有js文件
              dest: 'build/'//输出到此目录下
          }]
      },
    }
  });

  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('minall', ['uglify:buildall']);

};
