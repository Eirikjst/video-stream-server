$(document).ready(function () {
    $.ajax({
        url: '/tree',
        type: 'GET',
        contentType: 'application/json',
        success: function (data, textStatus, jqXHR) {
            displayData(data);
            clickHandler();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });
});

let newList = [];

function displayData(data) {
    makeList(data);
    $(`body`).append(newList.join(''));
}

function makeList(data) {
    newList.push(`<ul>`);
    $.each(data, function (attribute, val) {
        //checks if file, adds path and size to <li> element if true
        if (val.type == "file") {
            newList.push(`<li class='video_file' video-file-path="${val.path}" video-file-size="${val.size}" video-file-extension="${val.extension}">` + val.name);
        } else {
            newList.push(`<li>` + val.name);
        }
        if (val.children) {
            makeList(val.children);
        }
        newList.push(`</li>`);
    });
    newList.push(`</ul>`);
}

function clickHandler() {
    $('li').click(function (e) {
        e.stopPropagation();
        if ($(this).attr('video-file-size')){
            //temp solution before fix with filesize where video-file-size % == 0 in backend
            if ($(this).attr('video-file-size') % 2 == 1){
                startStream($(this).attr('video-file-size'), $(this).attr('video-file-path'), $(this).attr('video-file-extension'));
            } else {
                alert("bug with filesize, fix inc...");
            }
        }
        if(this.getElementsByTagName("ul")[0] !== undefined){
            if (this.getElementsByTagName("ul")[0].style.display == "block") {
                $(this).find('ul').slideUp();
            } else {
                $(this).children(":first").slideDown();
            }
        }
    });
}

//TODO: implement video tag in index.html and feed the stream to tag
function startStream(size, path, extension){
    $.ajax({
        url: '/setFileVariables',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            video_file_size: size,
            video_file_path: path,
            video_file_extension: extension
        }),
        success: function(data, textStatus, jqXHR) {
            window.location.href = window.location.origin+'/video'
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
        }
    });
}