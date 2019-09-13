$(document).ready(function () {
    $.ajax({
        url: '/tree',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            displayData(data);
            clickHandler();
        },
        error: function (err) {
            console.log(err);
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
            newList.push(`<li class='video_file' video-file-path="${val.path}" video-file-size="${val.size}">` + val.name);
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
            //do something...
            console.log($(this).attr('video-file-size'))
            console.log($(this).attr('video-file-path'))
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