/**
 * Created by an.han on 15/1/1.
 */

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var util = require('./util');


var Ksend = function (config) {
    this.config = config || util.getConfig() || {};
}

Ksend.prototype.parseFrom = function () {
    var fromArr = (this.config.from || '').split('@');
    return {
        host: 'smtp.' + fromArr[1],
        user: this.config.from,
        password: this.config.password
    }
}


Ksend.prototype.setConfig = function (key, value) {
    this.config[key] = value;
    return this;
}


Ksend.prototype.getSmtpOpton = function () {
    var from = this.parseFrom();
    var smtpOption = {
        host: from.host,
        auth: {
            user: from.user,
            pass: from.password
        }
    }

    switch (from.host){
        case 'smtp.qq.com':
            smtpOption.port = 465;
            smtpOption.secure = true;
            break;
        default :
            break;
    }

    return smtpOption;
}


Ksend.prototype.send = function (mail, callback) {
    var self = this;
    var smtpOption = self.getSmtpOpton();
    var transport = nodemailer.createTransport(smtpTransport(smtpOption));
    transport.sendMail(util.extend({from: self.config.from, to: self.config.to}, mail), callback);
    return self;
}

module.exports = Ksend;