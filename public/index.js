$(document).ready(function() {
    $.ajax({
        url: '/tree',
        type: 'GET',
        contentType: 'application/json',
        success: function(data){
            displayData(data);
            clickListElements();
        },
        error: function(err){
            console.log(err);
        }
    });
});

let testlist = [];

function displayData(data) {
    makeList(data);
    $(`#list`).append(testlist.join(''));
}

function makeList(data) {
    testlist.push(`<ul>`);
    $.each(data, function(attribute, val) {
        if (val.type == "file") {
            testlist.push(`<li video-file-path="${val.path}" video-file-size="${val.size}">` + val.name);
        } else {
            testlist.push(`<li>` + val.name);
        }
        if (val.children) {
            makeList(val.children);
        }
        testlist.push(`</li>`);
    });
    testlist.push(`</ul>`);
}

function clickListElements() {
    $('li').click(function (e) {
        e.stopPropagation();
        if (this.getElementsByTagName("ul")[0].style.display == "block")
            $(this).find("ul").slideUp();
        else
            $(this).children(":first").slideDown();
    });
}