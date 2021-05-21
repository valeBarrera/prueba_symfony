$(document).ready(function(){
    fillTable();
});

function fillTable(){
    $.ajax({
        type: "GET",
        url: "/api/groups",
        data: {},
        dataType: "json",
        success: function (response) {
            var container = $("#container-data");
            response.forEach(ele => {
              var row_table = "";
              row_table += "<tr>";
              row_table += "<td>"+ ele.id+ "</td>";
              row_table += "<td>" + ele.name + "</td>";
              row_table += "<td>" + ele.desription + "</td>";
              row_table += "<td>" + getUsersForTable(ele.listuser) + "</td>";
              row_table += "</tr>";
              container.append(row_table);
            });
        },
    });
}

function getUsersForTable(users){
    var html_str = '';
    users.forEach(user => {
        html_str += '<p>'+user.name+'</p>';
    });
    if(html_str == ''){
        html_str = '<p>Users not found</p>';
    }
    return html_str;
}