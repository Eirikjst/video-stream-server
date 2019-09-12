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

function displayData(data) {
    data.forEach(e => {
        let result = `<li id="${e.name}">${e.name}` + makeList(e.children)
        $(`#list`).append(`${result}</li>`);
    });
}

function makeList(data) {
    let temp = "";
    data.forEach(child => {
        if(child.type == "file"){
            temp = temp + `<li video-file-path="${child.path}" video-file-size="${child.size}">${child.name}</li>`;
        }
    }); 
    return `<ul>`+temp+`</ul>`;
}

function clickListElements(){
    $('li').click(function (e) {
        e.stopPropagation();
        if (this.getElementsByTagName("ul")[0].style.display == "block")
            $(this).find("ul").slideUp();
        else
            $(this).children(":first").slideDown();
    });
}