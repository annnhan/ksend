/**
 * Created by an.han on 15/1/1.
 */

var fs = require('fs');
var path = require('path');
var optimist = require('optimist');
var Ksend = require('./ksend');
var util = require('./util');

var ksend = new Ksend();
var pwd = process.env.PWD;
var argv = optimist.argv;

module.exports = function () {

    // 如果有设置项，设置之
    if (argv.from || argv.to) {

        // 设置默认发送邮箱
        if (argv.from) {
            if (!util.checkFromInput(argv.from)) {
                return console.error('输入有误，邮箱地址和密码请用“:”分隔，如 abc@qq.com:123456 。');
            }
            var from = argv.from.split(':')[0];
            var password = argv.from.split(':')[1];
            setConfig({from: from, password: password});
            console.log('设置默认发送邮箱成功，请将 ' + from + ' 添加至你的kindle已认可的发件人电子邮箱列表。');
        }

        //设置默认kindle接收邮箱
        if (argv.to) {
            if (!util.checkToInput(argv.to)) {
                return console.error('邮件地址格式错误。');
            }
            setConfig({to: argv.to});
            console.log('设置默认kindle接收邮箱成功。');
        }
    }

    // 显示帮助信息
    else if (argv.help || !argv._.length) {
        showHelp();
    }

    // 推送至kindle
    if (argv._.length) {
        var to = argv.m || ksend.config.to;
        var attachments = [];
        var nameStr = [];

        if (!ksend.config.from) {
            return console.error('默认发送邮箱未设置，请用 --from 设置。');
        }

        if (!to) {
            return console.error('kindle接收邮箱未指定，请用 -m 指定，或用 --to 设置默认接收邮箱。');
        }

        argv._.forEach(function (item) {
            var filename = util.getFileName(item);
            nameStr.push('  ' + filename)
            attachments.push({
                filename: filename,
                path: path.resolve(pwd, item)
            });
        });

        console.log('正在推送:\n' + nameStr.join('\n') + '\n共' + attachments.length + '个文档到 ' + to + ' ，请耐心等待...');

        util.zip(attachments, function (error, zipAttachments) {
            if (error) {
                return console.error('压缩文件失败：\n', error);
            }
            ksend.send({
                to: to,
                subject: 'convert',
                attachments: zipAttachments
            }, function (error, info) {
                removeTempFile(zipAttachments);
                if (error) {
                    console.error('推送失败：\n', error);
                }
                else {
                    console.log('恭喜！推送成功。');
                }
            });
        });
    }
}

function setConfig(obj) {
    for (var i in obj) {
        util.setConfig(i, obj[i]);
        ksend.setConfig(i, obj[i]);
    }
}

function removeTempFile(files) {
    files.forEach(function (file) {
        fs.unlinkSync(file.path);
    })
}

function showHelp() {
    console.log(
        'Usage: ksend [-m mail] file            推送文档 \n' +
        '   or: ksend [--from mail:password]    设置默认发送邮箱 \n' +
        '   or: ksend [--to mail]               设置默认接收邮箱 \n' +
        '\n' +
        'Options: \n' +
        '   --from  设置默认发送邮箱和密码，邮箱地址和密码请用“:”分隔，格式如 abc@qq.com:123456 \n' +
        '   --to    设置默认kindle接收邮箱\n' +
        '   -m      设置当前kindle接收邮箱，推送时如果不带此参数，则使用默认接收邮箱\n' +
        '   --help  显示帮助信息'
    );
}



