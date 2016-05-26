var fs = require('fs');
var obj;
var GeoPublic = {};

function countoccurrencies(s, dic) {

    var t = {}, i = 0, n = dic.length, o = 0;
    while (i < n) {
        t = dic[i];
        if (t.id == s) {
            o++;
        }
        i++;
    }
    return o;
};

fs.readFile('./public/resources/languages/pt.js', 'utf8', function (err, data) {
    if (err) throw err;
    // obj = JSON.parse(data);
    eval(data);
    console.log(GeoPublic.Translation.length);

    console.log('Duplicated entries on pt:');
    var onlykeys = [];
    GeoPublic.Translation.forEach(function (element, index, array) {
        // onlykeys.push(element.id);
        // console.log('a[' + index + '] = ' + element.id);
        if (countoccurrencies(element.id, GeoPublic.Translation) > 1) {
            console.log(element.id);
        }
    });

    GeoPublic.pt = GeoPublic.Translation;
    GeoPublic.Translation = {};

    fs.readFile('./public/resources/languages/el.js', 'utf8', function (err, data) {
        if (err) throw err;
        eval(data);
        console.log(GeoPublic.Translation.length);

        GeoPublic.el = GeoPublic.Translation;

        console.log('Keys missing on Greek translation:');
        var onlykeys = [];
        GeoPublic.pt.forEach(function (element, index, array) {
            if (countoccurrencies(element.id, GeoPublic.el) == 0) {
                console.log(element);
            }
        });

        console.log('Duplicated entries on el:');
        GeoPublic.el.forEach(function (element, index, array) {
            // onlykeys.push(element.id);
            // console.log('a[' + index + '] = ' + element.id);
            if (countoccurrencies(element.id, GeoPublic.el) > 1) {
                console.log(element.id);
            }
        });

    });


});

