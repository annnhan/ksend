/**
 * Created by an.han on 15/1/2.
 */
var fs = require('fs');

var txt = fs.readFileSync('/Users/hanan/微云同步盘/学习资料/book/test.txt');
//var txt = fs.readFileSync('/Users/hanan/test.txt');
//var txt = fs.readFileSync('./package.json');
//var txt = fs.readFileSync('./progit_中文版.pdf');

console.log(JSON.parse(txt));

