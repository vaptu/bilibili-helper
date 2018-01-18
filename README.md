# bilibili-helper

A Node.js Toolkit for Bilibili live service

## Installation

```bash
npm run build
npm run test:room
```

## Tip
* 本项目最初源码由[pandaGao](https://github.com/pandaGao)开发的[bilibili-live](https://github.com/pandaGao/bilibili-live)生成
* 由于老项目已无法正常使用，造成新版BiliBili live使用的问题，本仓库代码进行维护更新
* 感谢pandaGao的贡献

## 更新进度
版本号：2018/01/18
* 添加ffmpeg支持，支持并行rtmp推流、弹幕互动、用户互动等功能
* 代码暂且支持ffmpeg视频推流；支持playlist；支持弹幕互动查询指令;
* 支持循环播放参数，已迁移至配置文件中加载，支持循环后自动读入
* 添加log4js日志

## License

MIT
