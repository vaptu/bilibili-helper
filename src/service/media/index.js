var ffmpeg = require('fluent-ffmpeg');
var _ = require('lodash');
var path = require('path');

export default class Media{
  constructor(config={}){
    this.config = config
    this.error = this.validate();
    this.current_media = '';
  }

  // 参数验证
  validate(){
    if(!this.config.rtmp_path)
      return '请配置直播间地址rtmp_path';

    if(!this.config.rtmp_code)
      return '请配置直播间rtmp_code';

    if(!this.config.playlist || this.config.playlist.length == 0)
      return '播放列表为空或不存在'

    return true;
  }

  // 开始播放
  async  play(loop=false){
    if(this.error != true)
      return {status: false, message: this.error};

    var outputPath = this.config.rtmp_path + this.config.rtmp_code;
    var that = this;
   
    function playitem(item){
      return new Promise( (resolve, reject) => {
       ffmpeg()
         .input(path.resolve('resources/video/' + item))
         .inputOptions([
           '-re',
         ])
         .addOptions([
           '-c copy'
         ])
         .format('flv')
         .on('start', function(commandLine){
           that.current_media = item;
           console.log('正在播放: ' + item)
         })
         .on('error', function(err, stdout, stderr){
           console.log(err.message);
           console.log(stdout);
           console.log(stderr);
           resolve();
         })
         .on('end', function(){
           console.log(item + ' play end.')
           resolve();
         })
         .output(outputPath, { end: true})
         .run();
      })
    }

    do{
      for(var x in this.config.playlist){
        await playitem(this.config.playlist[x]);
      }
    }while(loop)

    return {status: true, message: '播放结束'};
  }
}
