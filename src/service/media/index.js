var ffmpeg = require('fluent-ffmpeg');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var colors = require('colors');
import logging from '../../utils/log.js'

export default class Media{
  constructor(config={}){
    this.config = config
    this.error = this.validate();
    this.current_media = '';
  }

  // 参数验证
  validate(){
    logging.debug('asdasd')
    if(!this.config.rtmp_path){
      logging.error('未配置直播间地址rtmp域名');
      return '请配置直播间地址rtmp_path';
    }

    if(!this.config.rtmp_code){
      logging.error('未配置直播间地址rtmp code');
      return '请配置直播间rtmp_code';
    }

    if(!this.config.playlist){
      logging.debug('使用默认播放列表');
      this.config.playlist = path.resolve('config/playlist.json');
    }

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
           logging.info('正在播放: ' + item)
         })
         .on('error', function(err, stdout, stderr){
           logging.error(err.message);
           logging.debug(stdout);
           logging.debug(stderr);
           resolve();
         })
         .on('end', function(){
           logging.info(item + ' play end.')
           resolve();
         })
         .output(outputPath, { end: true})
         .run();
      })
    }

    do{
      try{
        var buf = JSON.parse(fs.readFileSync( this.config.playlist, 'utf-8' ));
        if(buf.length == 0){
          logging.error('播放列表为空'.warn);
          break;
        }
      }catch(e){
        logging.debug(e);
        logging.error('播放列表JSON解析失败'.red);
        break;
      }
      for(var x in buf){
        await playitem(buf[x]);
      }
    }while(loop)

    logging.info('播放结束');
    return {status: true, message: '播放结束'};
  }
}
