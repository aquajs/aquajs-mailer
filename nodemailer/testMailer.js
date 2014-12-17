var Emailer = require('./index')
var path = require('path');
var pathname = path.resolve(__dirname, '../test', 'templates');

var templateContext = {
  name: 'Uma'
};

var mailContext = {
  from: 'Uma More <uma.more96@gmail.com>',
  to: 'uma.more96@gmail.com',
  subject: 'Hello',
  format: 'html'
  //attachment: attachments
};

var callback = function(){
    console.log('there was an error');
};

Emailer.prototype.send('/welcome/welcome.html', templateContext, mailContext, callback)