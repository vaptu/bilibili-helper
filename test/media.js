const { Media } = require('../dist/bilibili-live.js')

function initMedia(config){
  new Media(config)
    .play()
    .then( (data)=>{
      console.log(data)
    } )
}

//视频文件根目录为resource/video
initMedia({
  rtmp_path: '',
  rtmp_code: '',
  playlist: [
    'main.mp4',
  ]
});

