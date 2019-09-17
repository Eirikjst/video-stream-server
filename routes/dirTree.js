const directorytree = require('directory-tree');

/**
 * Sends directory tree to html page
 */
module.exports = function (app, config) {
    app.get(config.baseUrl+'tree', function (req, res) {
        let videoFiles = [], subtitles = [], pathToFolders = [];
        try {
            //Push each path from json file to array
            config.folders.forEach(e => {
                let temp = "";
                temp = temp.concat(config.drive, e);
                pathToFolders.push(temp);
            });
            /* 
            return tree with following structure
            {
                path: "",
                name: "",
                size: "",
                extension: "",
                type: ""
            }*/
            pathToFolders.forEach(e => {
                videoFiles.push(directorytree(e, { exclude: /\.srt$/ }));
                subtitles.push(directorytree(e), { extensions: /\.srt/ });
            })
        } catch (err) {
            console.error(err.stack);
            res.status(500).send('500 INTERNAL_SERVER_ERROR');
        } finally {
            res.status(200).send(videoFiles);
        }
    });
}