'use strict';
const fs= require('fs');

const folders = ['build/static/js','build/static/css'];
const prodFilePrefix = 'webrtc';


const resultPath = 'build';
function updateFiles(dir) {
    fs.readdir(dir, function(err,files) {
        files.forEach( function(file) {
            const splitFileName = file.split('.');
            let newFile = `${prodFilePrefix}.${splitFileName[2]}`;
            newFile += (splitFileName.length===4) ? `.${splitFileName[3]}` :``;
            fs.renameSync(`${dir}/${file}`, `${resultPath}/${newFile}`);
        });
    });
};

folders.forEach(updateFiles);
