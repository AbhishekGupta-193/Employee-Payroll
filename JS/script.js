$(function (e) {
    getEmployeeDetails();
    $("#tbl-details").on("click", ".editBtn", function () {
        editRow(this);
    });

    $("#tbl-details").on("click", ".deleteBtn", function () {
        deleteRow(this);
    });
});


//API CALL TO GET DATA FROM DB.JSON
function getEmployeeDetails() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/Employee",
        success: function (res) {
            for (var i = 0; i < res.length; i++) {
                let data = `
                <tr data-id="${res[i].id}">
                    <td class="table_val_name"><img src="./Assets/${res[i].url}" height="30px" width="30px"><span class="span_name">${res[i].name}</span></td>
                    <td class="table_val">${res[i].gender}</td>
                    <td class="table_val"><span style="background-color: #E9FEA5;"></span>${res[i].department}</td>
                    <td class="table_val">${res[i].salary}</td>
                    <td class="table_val">${res[i].startDate}</td>
                    <td class="table_val"><img src="./Assets/delete-black-18dp.svg" class="deleteBtn">&nbsp;&nbsp;&nbsp;&nbsp;<img src="./Assets/create-black-18dp.svg" class="editBtn"></td>
                </tr>
                `;
                $("#tbl-details").append(data);
            }
        },
        error: function (err) {
            console.error("Error fetching employee details:", err);
        }
    });
}


//FUNCTION TO EDIT TABLE DATA
function editRow(button) {
    var row = $(button).closest("tr");
    var id = row.data("id");
    $.ajax({
        type: "GET",
        url: `http://localhost:3000/Employee/${id}`,
        success: function (res) {
            localStorage.setItem("editEmployee", JSON.stringify(res));
            window.location.href = "/Templates/add-user.html";
        },
        error: function (err) {
            console.error("Error fetching employee details:", err);
        }
    });
}


//FUNCTION TO DELETE TABLE DATA
function deleteRow(element) {
    let row = $(element).closest('tr');
    let id = row.data('id');
    
    // //API CALL TO UPDATE DATA IN DB.JSON
    $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/Employee/${id}`,
        success: function (res) {
            console.log("Row deleted successfully:", res);
            row.remove();
        },
        error: function (err) {
            console.error("Error deleting row:", err);
        }
    });
}

//VARIABLE DECLARATIONS
let submit_btn = document.querySelector('.submit');
let table = document.querySelector('table');
let profile_img;
let fname = document.querySelector('#name');
let gender;
let department;
let salary;
let start_date;


// let gender=document.querySelector('input[name="Gender"]:checked ');  //not working


//EVENT LISTENER FOR SUBMIT BUTTON IN CASE OF ADDING NEW DATA TO TABLE 
submit_btn.addEventListener('click', function (event) {
    if (localStorage.length == 0) {
        event.preventDefault();
        profile_img = document.querySelector('input[name="img"]:checked');
        if (profile_img) {
            console.log(profile_img.value);
        }
        else {
            console.log("No profile_img Selected")
        }

        gender = document.querySelector('input[name="Gender"]:checked ');
        if (gender) {
            console.log(gender.value);
        }
        else {
            console.log("No Gender Selected")
        }

        department = document.querySelector('.dept_checkbox:checked');

        salary = document.querySelector('#salary');

        const day = document.querySelector('#day').value;
        const month = document.querySelector('#month').value;
        const year = document.querySelector('#year').value;
        start_date = day + " " + month + " " + year;

        const newUser = {
            url: profile_img.value,
            name: fname.value,
            gender: gender.value,
            department: department.value,
            salary: salary.value,
            startDate: start_date
        };

        //API CALL TO POST DATA INTO DB.JSON
        $.ajax({
            url: 'http://localhost:3000/Employee',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newUser),
            success: function (data) {
                console.log('User added:', data);
                window.opener.location.reload();
            },
            error: function (error) {
                console.error('Error:', error);
            }
        })
    }
    window.location.href = "/index.html"; 
})

//LOAD INITAL VALUES IN THE FORM IN CASE OF EDITING TABLE ROW
$(document).ready(function () {
    var employee = JSON.parse(localStorage.getItem("editEmployee"));
    var dateParts = employee.startDate.split(" ");
    var day = dateParts[0];
    var month = dateParts[1];
    var year = dateParts[2];

    if (employee) {
        $("input[name='img'][value='" + employee.url + "']").prop("checked", true);
        $("#name").val(employee.name);
        $("input[name='Gender'][value='" + employee.gender + "']").prop("checked", true);
        $("#department").val(employee.department).prop("checked", true);
        $("#salary").val(employee.salary);
        $("#day").val(day);
        $("#month").val(month);
        $("#year").val(year);
    }


    //EVENT LISTENER FOR SUBMIT BUTTON IN CASE OF ADDING EDITED DATA TO TABLE 
    $(submit_btn).on("click", function (e) {
        e.preventDefault();

        var day = $("#day").val();
        var month = $("#month").val();
        var year = $("#year").val();
        startDate = day + " " + month + " " + year;

        var updatedEmployee = {
            id: employee.id,
            url: $("input[name='img']:checked").val(),
            name: $("#name").val(),
            gender: $("input[name='Gender']:checked").val(),
            department: $(".department:checked").val(),
            salary: $("#salary").val(),
            startDate: startDate,
        };

        $.ajax({
            type: "PUT",
            url: `http://localhost:3000/Employee/${employee.id}`,
            data: JSON.stringify(updatedEmployee),
            contentType: "application/json",
            success: function (res) {
                alert("Employee details updated successfully!");
            },
            error: function (err) {
                console.error("Error updating employee details:", err);
            }
        });
        localStorage.clear();
        window.location.href = "/index.html"; 
    });
});

//SHOW SEARCH BAR FUNCTION ON CLICKING THE SEARCH ICON
function show_searchBar() {
    const searchIcon = document.querySelector('.search');
    const searchBar = document.querySelector('#search-bar');
    searchIcon.style.display = 'none';
    searchBar.style.display = 'block';
    searchBar.focus();

    fetch('/DB/db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(fetchedData => {
            data = fetchedData;
            console.log("Date here ", data.Employee[0]); 
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

//SEARCH FUNCTION FOR THE TABLE ENTRIES
function onSearch() {
    var search = document.getElementById("search-bar").value;
    search = search.toLowerCase();
    var table, tr, td, txtvalue, index;
    table = document.getElementById("tbl-details");
    tr = table.getElementsByTagName("tr");

    for (var i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        td2 = tr[i].getElementsByTagName("td")[1];
        td3 = tr[i].getElementsByTagName("td")[2];
        if (td || td2 || td3) {
            txtvalue = td.textContent || td.innerHTML;
            txtvalue2 = td2.textContent || td2.innerHTML;
            txtvalue3 = td3.textContent || td3.innerHTML;
            if (txtvalue.toLocaleLowerCase().indexOf(search) > -1 || txtvalue2.toLocaleLowerCase().indexOf(search) > -1 || txtvalue3.toLocaleLowerCase().indexOf(search) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
};

//RESET BUTTON FUNCTION
document.getElementById("resetButton").addEventListener("click", function () {
    document.getElementById("name").value = "";
    document.querySelectorAll("input[name='img']").forEach(input => input.checked = false);
    document.querySelectorAll("input[name='Gender']").forEach(input => input.checked = false);
    document.querySelectorAll(".dept_checkbox").forEach(input => input.checked = false);
    document.getElementById("salary").value = "";
    document.getElementById("day").value = "";
    document.getElementById("month").value = "";
    document.getElementById("year").value = "";
    document.getElementById("txtarea").value = "";
});

//CANCEL BUTTON FUNCTION
document.getElementById("cancelButton").addEventListener("click", function () {
    window.location.href = "/index.html";
});

