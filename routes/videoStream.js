const fs = require('fs');
let ffmpeg = require('fluent-ffmpeg');
let video_file_extension;
let video_file_path;
let video_file_size;

module.exports = function (app, config) {
    app.post(config.baseUrl + 'setFileVariables', function (req, res) {
        video_file_extension = req.body.video_file_extension.replace('.', '');
        video_file_path = req.body.video_file_path;
        video_file_size = req.body.video_file_size;

        if ((video_file_extension != undefined) && (video_file_path != undefined) && (video_file_size != undefined)) {
            if (video_file_extension == 'mp4') {
                res.status(200).send('mp4');
            } else {
                res.status(200).send('webm')
            }
        } else {
            res.status(500).send('Internal Server Error');
        }
        console.log('path (' + video_file_path + ') with size: ' + video_file_size);
    });

    //TODO: implement error handling
    app.get(config.baseUrl + 'stream', function (req, res) {
        if (video_file_extension != 'mp4') {
            let ffmpegstream = ffmpeg(video_file_path)
                .setFfmpegPath('E:\\Programmer\\ffmpeg\\bin\\ffmpeg.exe')
                .videoCodec('libvpx')
                .audioCodec('libvorbis')
                .format('webm')
                .on('end', function () {
                    console.log('File done');
                })
                .on('error', function (err, stdout, stderr) {
                    console.log('something went wrong: ' + err.message);
                    console.log('\n\nffmpeg stdout: ' + stdout);
                    console.log('\n\nffmpeg stderr: ' + stderr);
                })
                .pipe(res, { end: true });
        } else {
            let responseHeaders = {};
            if (req.headers['range']) {

                let range = req.headers.range.split(/[-=]/);
                let start = +range[1];
                let end = range[2] ? +range[2] : video_file_size - 1
                let chunksize = end - start + 1;

                console.log('Range: ' + start + ' - ' + end + ' = ' + chunksize);

                responseHeaders = {
                    'Content-Range': 'bytes ' + start + '-' + end + '/' + video_file_size,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                }

                res.writeHead(206, responseHeaders);
                fs.createReadStream(video_file_path, { start: start, end: end }).pipe(res);

            } else {
                console.log('ALL: ' + video_file_size)

                responseHeaders = {
                    'Content-Length': video_file_size,
                    'Content-Type': 'video/mp4',
                }

                res.writeHead(200, head);
                fs.createReadStream(video_file_path).pipe(res)
            }
        }
    });
}
