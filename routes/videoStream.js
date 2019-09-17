const fs = require('fs')
let video_file_extension;
let video_file_path;
let video_file_size;

//https://gist.github.com/paolorossi/1993068
//https://www.codeproject.com/Articles/813480/HTTP-Partial-Content-In-Node-js

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
        if (req.headers['range']) {
            /*
            let range = req.headers.range.replace(/bytes=/, '').split('-')
            console.log(range)

            let start = parseInt(range[0], 10);
            let end = range[1] ? parseInt(range[1], 10) : video_file_size - 1;
            let chunksize = (end-start)+1;

            */

            let range = req.headers.range.split(/[-=]/);
            console.log(range)
            let start = +range[1];
            let end = range[2] ? +range[2] : video_file_size - 1
            chunksize = end - start + 1;

            console.log('Range: '+start+' - '+end+' = '+chunksize);
            let responseHeaders = {
                'Content-Range': 'bytes '+start+'-'+end+'/'+video_file_size,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',         
            }

            res.writeHead(206, responseHeaders);
            fs.createReadStream(video_file_path,{start: start, end: end}).pipe(res);
            
            //const end = parts[1]
            //    ? parseInt(parts[1], 10)
            //    : video_file_size - 1
                
            /*
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
            
            let file = fs.createReadStream(video_file_path, { start, end });
            let head = {
                'Content-Range': `bytes ${start}-${end}/${video_file_size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': start == end ? 0 : (end - start + 1),
                'Content-Type': 'video/mp4',
            }

            res.writeHead(206, head);
            file.pipe(res);
            */
        } else {
            console.log('ALL: '+video_file_size)
            let head = {
                'Content-Length': video_file_size,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head);
            fs.createReadStream(video_file_path).pipe(res)
        }
    });



    /*
    app.get(config.baseUrl + 'stream', function(req, res){
        let responseHeaders = {};
        let rangeRequest = readRangeHeader(req.headers['range'], video_file_size);
        console.log(rangeRequest)

        if (rangeRequest == null){
            responseHeaders['Content-Length'] = video_file_size;
            responseHeaders['Content-Type'] = 'video/mp4';
            console.log('rangeRequest == null')
            sendResponse(res, 200, responseHeaders, fs.createReadStream(video_file_path));
            return null;
        }

        let start = rangeRequest.Start;
        let end = rangeRequest.End;

        if ((start >= video_file_size) || (end >= video_file_size)){
            responseHeaders['Content-Range'] = 'bytes *//*' + video_file_size;
            console.log(416)
            sendResponse(res, 416, responseHeaders, null);
            return null;
        }

        responseHeaders['Accept-Ranges'] = 'bytes';
        responseHeaders['Cache-Control'] = 'no-cache';
        responseHeaders['Content-Range'] = 'bytes ' + start + '-' + end + '/' + video_file_size;
        responseHeaders['Content-Length'] = start == end ? 0 : (end - start + 1);
        responseHeaders['Content-Type'] = 'video/mp4';
        responseHeaders['X-Content-Duration'] = 4927.00;
        
        console.log(206)
        sendResponse(res, 206, responseHeaders, fs.createReadStream(video_file_path, {start: start, end: end}));
    });

}

function readRangeHeader(range, totalLength){
    if (range == null || range.length == 0){
        return null
    }
    let parts = range.split(/bytes=([0-9]*)-([0-9])/);
    console.log(parts)
    let start = parseInt(parts[1]);
    let end = parseInt(parts[2]);
    let result = {
        Start: isNaN(start) ? 0 : start,
        End: isNaN(end) ? (totalLength - 1) : end
    }

    if (!isNaN(start) && isNaN(end)){
        result.Start = start;
        result.End = totalLength - 1;
    }
    if (isNaN(start) && !isNaN(end)){
        result.Start = totalLength - end;
        result.End = totalLength - 1
    }

    return result;
}

function sendResponse(response, responseStatus, responseHeaders, stream){
    response.writeHead(responseStatus, responseHeaders);

    if (stream == null){
        res.end();
    } else {
        stream.on('open', function(){
            stream.pipe(response);
        });
    }*/
}
