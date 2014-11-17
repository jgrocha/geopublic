/**
 * Created by jgr on 15-11-2014.
 */

var gm = require('gm');
var fs = require('fs');

file = 'uploads/417a66c7d2ae9f0a989aabdb3fb2f608';

gm(file).identify(function (err, data) {
    console.log(data);
    if (err) {
        // Penso que não se trata de uma imagem
        console.log("Upload failed. Can't identify file format. File does not exist or no decode exist for this file format.");
    } else {
        console.log(data);
    }
});
