var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    // host: 'mail.cm-agueda.pt',
    host: 'mail.geomaster.pt',
    port: 465,
    secure: true,
    tls: {
        rejectUnauthorized: false
    },
    debug: true,
    auth: {
        user: 'ppgis@geomaster.pt',
        pass: '20150507'
    }
}));

var mailOptions = {
    from: 'ppgis@geomaster.pt',
    to: 'angela@jorge-gustavo-rocha.pt',
    subject: 'hello world!',
    text: 'Mandado pelo node.js'
};

transporter.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: ", response);
    }
    transporter.close(); // shut down the connection pool, no more messages
});

/*
transport.on('log', function(log) {
    console.log('log', log);
});
*/
