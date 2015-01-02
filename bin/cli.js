#!/usr/bin/env node

var fs = require('fs');
var path =require('path');

var config = path.join(__dirname, '../src/config.json');
if (!fs.existsSync(config)) {
    fs.writeFileSync(config, JSON.stringify({}));
}
require('./../src/cli')();
