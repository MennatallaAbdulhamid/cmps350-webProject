document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded successfully');

const logincontainer = document.getElementById("login-container");

//<div class="MYCSE">
//     <h1 class="WELCOME">Welcome to MYCSE Portal</h1>
//     <div class="loginContainer">
    //     <div class="logininfo">
        //     <i class="fas fa-graduation-cap"></i>
        //     <h2 class="login">LOGIN</h2>
        //     <p>Please enter you credentials to acsess your dashboard</p> </div>
    // <div class="loginform">
    //     <div class="input-container">
    //         <i class="fa-solid fa-user"></i>
    //         <label for="email"></label>
    //          <input type="email" placeholder="Enter your Email" name="uname" required>  </div>
    //     
    // <div class="input-container">  
    //          <i class="fa-solid fa-lock"></i>
    //          <label for="psw"></label>
    //             <input type="password" placeholder="Enter your Password" name="psw" required> </div>
// <button type="submit">LOGIN</button> 
//     </div>
// </div>  

const mycseDiv = document.createElement('div');
mycseDiv.classList.add('MYCSE');

const welcomeDiv = document.createElement('h1');
welcomeDiv.classList.add('WELCOME');
welcomeDiv.textContent = 'Welcome to MYCSE Portal';
mycseDiv.appendChild(welcomeDiv);

const loginContainerDiv = document.createElement('div');
loginContainerDiv.classList.add('loginContainer');

const loginInfoDiv = document.createElement('div');
loginInfoDiv.classList.add('logininfo');

const unversityiconDiv = document.createElement('i');
unversityiconDiv.classList.add('fas', 'fa-graduation-cap');

const loginTitleDiv = document.createElement('h2');
loginTitleDiv.classList.add('login');
loginTitleDiv.textContent = 'LOGIN';

const loginTextDiv = document.createElement('p');
loginTextDiv.textContent = 'Please enter you credentials to acsess your dashboard';

loginInfoDiv.appendChild(unversityiconDiv);
loginInfoDiv.appendChild(loginTitleDiv);
loginInfoDiv.appendChild(loginTextDiv);



// create the form 
const loginformDiv = document.createElement('div');
loginformDiv.classList.add('loginform');

const inputContainerDiv = document.createElement('div');
inputContainerDiv.classList.add('input-container');

const usericonDiv = document.createElement('i');
usericonDiv.classList.add('fa-solid', 'fa-user');

const emailInput = document.createElement('input');
emailInput.setAttribute('type', 'email');
emailInput.setAttribute("placeholder", "Enter your Email");
emailInput.setAttribute('name', 'email');
emailInput.setAttribute('required', '');

inputContainerDiv.appendChild(usericonDiv);
inputContainerDiv.appendChild(emailInput);

const inputContainerDiv2 = document.createElement('div');
inputContainerDiv2.classList.add('input-container');

const pswiconDiv = document.createElement('i');
pswiconDiv.classList.add('fa-solid', 'fa-lock');

const passwordInput = document.createElement('input');
passwordInput.setAttribute('type', 'password');
passwordInput.setAttribute("placeholder", "Enter your Password");
passwordInput.setAttribute('name', 'psw');
passwordInput.setAttribute('required', '');

inputContainerDiv2.appendChild(pswiconDiv);
inputContainerDiv2.appendChild(passwordInput);

const loginbttn = document.createElement('button');
loginbttn.textContent = 'LOGIN';

//append 
loginformDiv.appendChild(inputContainerDiv);
loginformDiv.appendChild(inputContainerDiv2);
loginformDiv.appendChild(loginbttn);
loginContainerDiv.appendChild(loginInfoDiv);
loginContainerDiv.appendChild(loginformDiv);
mycseDiv.appendChild(welcomeDiv);
mycseDiv.appendChild(loginContainerDiv);
logincontainer.appendChild(mycseDiv);
 


loginbttn.addEventListener("click", function() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    fetch('users.json')
        .then(response => response.json())
        .then(users => {
            const user = users.find(user => user.email === email && user.password === password);

        if (user) {
                console.log("User found:", user);
                sessionStorage.setItem('user', JSON.stringify(user)); // to store user info
                alert('You are logged in successfully');

                if (user.role === 'student') {
                window.location.href = 'studentDashboard.html'; //link to the main page (dashboard.html)
                } else if (user.role === 'instructor') {
                window.location.href = 'instructorDashboard.html'; //link to the main page (instructordashboard.html)
                }
                else if (user.role === 'admin') {
                window.location.href = 'adminDashboard.html'; //link to the main page (admindashboard.html)
            }
        } else {
                alert('Invalid email or password. Please try again');
            }
        }) 
        .catch(error => console.error("Error loading users:",error));
});



















console.log(mycseDiv); // Logs the <div class="MYCSE">
console.log("javascript is working"); 







});