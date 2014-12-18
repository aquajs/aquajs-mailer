var Emailer = require('../nodemailer/index');
var path = require('path');
var testAttachmentsPath = path.join(__dirname, './attachments');

var templateContext = {
  name: 'Uma'
};

var attachment1 = path.join(testAttachmentsPath, 'attachment1');
var attachment2 = path.join(testAttachmentsPath, 'attachment2');

var attachments = [
  attachment1,
  attachment2
];

var mailContext = {
  from: 'Uma More <uma.more96@gmail.com>',
  to: 'umore@equinix.com',
  subject: 'Hello',
  format: 'html',
  attachment: attachments
};

var callback = function(){
  console.log('there was an error');
};

Emailer.prototype.send('welcome/welcome.html', templateContext, mailContext, function (err, message) {
  if (err) return err;

  console.log('logging message in callback: ' + message);
});

