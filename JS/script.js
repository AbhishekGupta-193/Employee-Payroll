let submit_btn=document.querySelector('.submit');
let table=document.querySelector('table');

let profile_img;
let fname=document.querySelector('#name');
let gender;
let department;
let salary;
let start_date;

// let gender=document.querySelector('input[name="Gender"]:checked ');  //not working


submit_btn.addEventListener('click',function(event){
    event.preventDefault(); // Prevent form submission
    profile_img=document.querySelector('input[name="img"]:checked');
    if(profile_img){
        console.log(profile_img.value);
    }
    else{
        console.log("No profile_img Selected")
    }


    console.log(fname.value);


    gender=document.querySelector('input[name="Gender"]:checked ');
    if(gender){
        console.log(gender.value);
    }
    else{
        console.log("No Gender Selected")
    }

    department = document.querySelector('.dept_checkbox:checked');
    console.log(department.value);

    salary=document.querySelector('#salary');
    console.log(salary.value);

    const day=document.querySelector('#day').value;
    const month=document.querySelector('#month').value;
    const year=document.querySelector('#year').value;
    start_date = day + " " + month + " " + year;

    console.log(start_date)

       const newUser = {
            url:profile_img.value,
            name: fname.value,
            gender:gender.value,
            department: department.value,
            salary: salary.value,
            startDate: start_date
        };
 
        $.ajax({
            url: 'http://localhost:3000/Employee',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newUser),
            success: function(data) {
                console.log('User added:', data);
                window.opener.location.reload();
            },
            error: function(error) {
                console.error('Error:', error);
            }
 
        })
   

})

function show_searchBar(){
    // console.log("here is search bar");
    const searchIcon = document.querySelector('.search');
    const searchBar = document.querySelector('#search-bar');
    searchIcon.style.display = 'none';
    searchBar.style.display = 'block';
    searchBar.focus();

}

document.querySelector('#search-bar').addEventListener('input', function() {
    // clearTimeout(this.delay);
    // this.delay = setTimeout(function() {
    //     const searchQuery = searchBar.value;
    //     console.log("User entered:", searchQuery);
    // }, 2500);
    console.log("kjsnfkls")                     //not working
    const keyword = this.value.toLowerCase();
    console.log(keyword)
    fetch('/DB/db.json')
        .then(response => response.json())
        .then(data => {
            const employees = data.Employee;
            console.log(employees)
            const filteredEmployees = employees.filter(employee => {
                return Object.values(employee).some(value =>
                    value.toString().toLowerCase().includes(keyword)
                );
            });
            displayEmployees(filteredEmployees);
        });
});

function displayEmployees(employees) {
    const tableBody = document.querySelector('#employee-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    employees.forEach(employee => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerHTML = `<img src="${employee.url}" alt="Profile Image">`;
        row.insertCell(1).textContent = employee.name;
        row.insertCell(2).textContent = employee.gender;
        row.insertCell(3).textContent = employee.department;
        row.insertCell(4).textContent = employee.salary;
        row.insertCell(5).textContent = employee.startDate;
        row.insertCell(6).textContent = employee.id;
    });
}



























