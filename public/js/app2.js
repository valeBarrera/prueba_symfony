$(document).ready(function () {
    resetForm();
    $('#send-group').on('click',submitGroup);
});

function cleanInput(){
    $('#name').removeClass('is-invalid');
    $('#description').removeClass('is-invalid');
}

function resetForm(){
    $('#create-group-form').trigger('reset');
}

function submitGroup(){
    var name =  $('#name').val();
    var description =  $('#description').val();

    cleanInput();

    $.ajax({
        type: "POST",
        url: "/api/groups",
        data: {
            name: name,
            description: description,
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
            if(fields.name.errors != null){
                var message = fields.name.errors[0];
                $('#invalid-name').html(message);
                $('#name').addClass('is-invalid');
            }
            if(fields.description.errors != null){
                var message = fields.description.errors[0];
                $('#invalid-description').html(message);
                $('#description').addClass('is-invalid');
            }
        }
    });
}