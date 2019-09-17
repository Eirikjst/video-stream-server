module.exports = function(app, config) {
    app.post(config.baseUrl+'stream', function(req, res) {
        if (!(req.body.video_file_extension == '.mp4')){
            res.status(501).send('Not implemented support for file type(only .mp4)');
        } else {
            console.log(req.body)
            res.status(200).send(true);
        }
    });
}