/**
 * Created by an.han on 15/1/1.
 */

var fs = require('fs');
var path = require('path');
var archiver = require('archiver');

var configPath = path.join(__dirname, './config.json');

var regFrom = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,5}):\S+$/;
var regTo = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,5})$/;

var util = {

    getConfig: function () {
        return JSON.parse(fs.readFileSync(configPath));
    },

    setConfig: function (key, value) {
        var config = JSON.parse(fs.readFileSync(configPath));
        config[key] = value;
        fs.writeFileSync(configPath, JSON.stringify(config));
    },

    extend: function (a, b) {
        for (var i in b) {
            if (typeof b[i] !== 'undefined') {
                a[i] = b[i];
            }
        }
        return a;
    },

    checkFromInput: function (val) {
        return regFrom.test(val);
    },

    checkToInput: function (val) {
        return regTo.test(val);
    },

    getFileName: function (file) {
        var arr = file.split('/');
        return arr[arr.length - 1];
    },

    parseTime: function (time) {
        time = time || new Date();
        var y = time.getFullYear();
        var M = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var m = time.getMinutes();
        var s = time.getSeconds();
        M = M > 9 ? M : '0' + M;
        d = d > 9 ? d : '0' + d;
        h = h > 9 ? h : '0' + h;
        m = m > 9 ? m : '0' + m;
        s = s > 9 ? s : '0' + s;
        return '' + y + M + d + h + m + s;
    },

    zip: function (attachments, callback) {
        var filename = 'ksend' + util.parseTime() + '.zip';
        var filePath = path.resolve(__dirname, '../temp', filename);
        var output = fs.createWriteStream(filePath);
        var archive = archiver('zip');

        output.on('close', function() {
            callback(null, [{
                filename: filename,
                path: filePath
            }])
        });

        archive.on('error', function(error) {
            callback(error)
        });

        archive.pipe(output);

        attachments.forEach(function (atta) {
            archive.append(fs.createReadStream(atta.path), {name: atta.filename});
        });

        archive.finalize();
    }
}

module.exports = util;