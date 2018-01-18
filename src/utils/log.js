const log4js = require('log4js');
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    file: { type: 'file', filename: 'log/live.log' }
  },
  categories: {
    default: {
      appenders: ['out', 'file'], level: 'info'
    }
  }
})

export default log4js.getLogger();
