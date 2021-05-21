$(document).ready(function(){
    fillTable();
});

function fillTable(){
    $.ajax({
        type: "GET",
        url: "/api/users",
        data: {},
        dataType: "json",
        success: function (response) {
            var container = $("#container-data");
            response.forEach(ele => {
              var row_table = "";
              row_table += "<tr>";
              row_table += "<td>"+ ele.id+ "</td>";
              row_table += "<td>" + ele.username + "</td>";
              row_table += "<td>" + ele.name + "</td>";
              row_table += "<td>" + ele.lastname + "</td>";
              row_table += "<td>" + ele.email + "</td>";
              row_table += "<td>" + getGroupsForTable(ele.listgroups) + "</td>";
              row_table += "</tr>";
              container.append(row_table);
            });
        },
    });
}

function getGroupsForTable(groups){
    var html_str = '';
    groups.forEach(group => {
        html_str += '<p>'+group.name+'</p>';
    });
    if(html_str == ''){
        html_str = '<p>Groups not found</p>';
    }
    return html_str;
}