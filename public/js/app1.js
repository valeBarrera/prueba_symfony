$(document).ready(function () {
    resetForm();
    getUsers();
    getGroups();
    $('#send-asignate').on('click',submitAsignation);
});

function resetForm(){
    $('#asignate-user-form').trigger('reset');
}

function getUsers(){
    $.ajax({
        type: "GET",
        url: "/api/users",
        data: {},
        dataType: "json",
        success: function (response) {
            console.log(response);
            response.forEach(ele => {
                var html_str = '<option value="'+ele.id+'">'+ele.name+' '+ele.lastname+'</option>';
                $('#users').append(html_str);
            });
        }
    });
}

function getGroups(){
    $.ajax({
        type: "GET",
        url: "/api/groups",
        data: {},
        dataType: "json",
        success: function (response) {
            console.log(response);
            response.forEach(ele => {
                var html_str = '<option value="'+ele.id+'">'+ele.name+' '+ele.description+'</option>';
                $('#groups').append(html_str);
            });
        }
    });
}

function submitAsignation(){
    var user_id = $('#users').val();
    var group_id = $('#groups').val();
    $.ajax({
        type: "POST",
        url: "/api/asignate",
        data: {
            user_id: user_id,
            group_id: group_id
        },
        dataType: "json",
        success: function (response) {
            console.log(response);
            resetForm();

            var title = "Successful";
            var message = response.message;

            $('#title-modal-form').html(title);
            $('#body-modal-form').html(message);

            $('#modalResponse').modal('show');
        },
    });
}