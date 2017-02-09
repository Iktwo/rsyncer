#!/usr/bin/env node

var INotifyWait = require('inotifywait');

var options = {}

for (var i = 0; i < process.argv.length; ++i) {
    var val = process.argv[i];

    switch (val) {
        case '-p':
            if (process.argv.length > i)
                options['path'] = process.argv[++i]
            break;
        case '-t':
            if (process.argv.length > i)
                options['target'] = process.argv[++i]
            break;
        case '-e':
            if (process.argv.length > i)
                options['exclude'] = process.argv[++i]
            break;
    }
}

if (!options.hasOwnProperty('path') || !options.hasOwnProperty('target')) {
    console.log("Error: usage is -p path -t target")
    process.exit(1);
}

const RSYNC_PARAMS = ['-rzhP', options.hasOwnProperty('exclude') ? "--exclude=" + options['exclude'] : '', options['path'], options['target']];

function dateFormat(date, format) {
    return format.replace(/%[YmdHMS]/g, function(m) {
        switch (m) {
            case '%Y':
                return date['getUTCFullYear']();
            case '%m':
                m = 1 + date['getUTCMonth']();
                break;
            case '%d':
                m = date['getUTCDate']();
                break;
            case '%H':
                m = date['getUTCHours']();
                break;
            case '%M':
                m = date['getUTCMinutes']();
                break;
            case '%S':
                m = date['getUTCSeconds']();
                break;
            default:
                return m.slice(1);
        }

        return ('0' + m).slice(-2);
    });
}

const spawn = require('child_process').spawn;
var rsync = spawn('rsync', RSYNC_PARAMS);

var watchDir = new INotifyWait(options['path'], {
    recursive: true,
    bin: '/usr/bin/inotifywait'
});

watchDir.on('add', function(filename) {
    console.log(dateFormat(new Date(), "%d/%m/%Y %H:%M:%S"), "Syncing..");
    rsync = spawn('rsync', RSYNC_PARAMS);

    rsync.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });
});

watchDir.on('change', function(filename) {
    console.log(dateFormat(new Date(), "%d/%m/%Y %H:%M:%S"), "Syncing..");
    rsync = spawn('rsync', RSYNC_PARAMS);

    rsync.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });
});
