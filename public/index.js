$(document).ready(function() {
    $.ajax({
        url: '/tree',
        type: 'GET',
        contentType: 'application/json',
        success: function(data){
            console.log(data);
        },
        error: function(err){
            console.log(err);
        }
    })
});