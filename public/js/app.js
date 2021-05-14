$(document).ready(function () {
    $('#send-user').on('click',submitUser);
});

function cleanInput(){
    $('#username').removeClass('is-invalid');
    $('#name').removeClass('is-invalid');
    $('#lastname').removeClass('is-invalid');
    $('#email').removeClass('is-invalid');
}

function resetForm(){
    $('#create-user-form').trigger('reset');
}

function submitUser(){
    var username =  $('#username').val();
    var name =  $('#name').val();
    var lastname =  $('#lastname').val();
    var email =  $('#email').val();

    cleanInput();

    $.ajax({
        type: "POST",
        url: "/api/users",
        data: {
            username: username,
            name: name,
            lastname: lastname,
            email: email
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
        error: function(error){
            console.log(error.responseJSON);
            var fields = error.responseJSON.errors.children;
            console.log(fields);
            if(fields.username.errors != null){
                var message = fields.username.errors[0];
                $('#invalid-username').html(message);
                $('#username').addClass('is-invalid');
            }
            if(fields.name.errors != null){
                var message = fields.name.errors[0];
                $('#invalid-name').html(message);
                $('#name').addClass('is-invalid');
            }
            if(fields.lastname.errors != null){
                var message = fields.lastname.errors[0];
                $('#invalid-lastname').html(message);
                $('#lastname').addClass('is-invalid');
            }
            if(fields.email.errors != null){
                var message = fields.email.errors[0];
                $('#invalid-email').html(message);
                $('#email').addClass('is-invalid');
            }
        }
    });
}