const fs = require('fs')
let video_file_extension;
let video_file_path;
let video_file_size;

module.exports = function (app, config) {
    app.post(config.baseUrl + 'setFileVariables', function (req, res) {
        if (req.body.video_file_extension == '.mp4') {
            video_file_extension = req.body.video_file_extension;
            video_file_path = req.body.video_file_path;
            video_file_size = req.body.video_file_size;

            if ((video_file_extension != undefined) && (video_file_path != undefined) && (video_file_size != undefined)) {
                res.status(200).send('OK');
            } else {
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(501).send('Not Implemented support for file type(only .mp4)');
        }
    });

    //TODO: implement error handling
    app.get(config.baseUrl + 'stream', function (req, res) {
        let range = req.headers.range;
        if (range) {
            let parts = range.replace(/bytes=/, "").split("-");
            let start = parseInt(parts[0], 10);
            
            /*const end = parts[1]
                ? parseInt(parts[1], 10)
                : video_file_size - 1
                */
            
            let end = 0;
            if (video_file_size % 2 != 0) {
                end = parts[1]
                    ? parseInt(parts[1], 10)
                    : video_file_size - 1;
            } else {
                end = parts[1]
                    ? parseInt(parts[1], 10)
                    : video_file_size;

                end = parseInt(end)
            }
            let chunksize = (end - start) + 1;
            let file = fs.createReadStream(video_file_path, { start, end });
            let head = {
                'Content-Range': `bytes ${start}-${end}/${video_file_size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            let head = {
                'Content-Length': video_file_size,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head);
            fs.createReadStream(video_file_path).pipe(res);
        }
    });
}