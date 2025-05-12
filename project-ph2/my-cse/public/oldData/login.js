document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded successfully');

    const logincontainer = document.getElementById("login-container");

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
    loginTextDiv.textContent = 'Please enter your credentials to access your dashboard';
    loginInfoDiv.appendChild(unversityiconDiv);
    loginInfoDiv.appendChild(loginTitleDiv);
    loginInfoDiv.appendChild(loginTextDiv);

    const loginformDiv = document.createElement('div');
    loginformDiv.classList.add('loginform');

    const inputContainerDiv = document.createElement('div');
    inputContainerDiv.classList.add('input-container');
    const usericonDiv = document.createElement('i');
    usericonDiv.classList.add('fa-solid', 'fa-user');
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'Enter your Email';
    emailInput.name = 'email';
    emailInput.required = true;
    inputContainerDiv.appendChild(usericonDiv);
    inputContainerDiv.appendChild(emailInput);

    const inputContainerDiv2 = document.createElement('div');
    inputContainerDiv2.classList.add('input-container');
    const pswiconDiv = document.createElement('i');
    pswiconDiv.classList.add('fa-solid', 'fa-lock');
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Enter your Password';
    passwordInput.name = 'psw';
    passwordInput.required = true;
    inputContainerDiv2.appendChild(pswiconDiv);
    inputContainerDiv2.appendChild(passwordInput);

    const loginbttn = document.createElement('button');
    loginbttn.textContent = 'LOGIN';

    loginformDiv.appendChild(inputContainerDiv);
    loginformDiv.appendChild(inputContainerDiv2);
    loginformDiv.appendChild(loginbttn);

    loginContainerDiv.appendChild(loginInfoDiv);
    loginContainerDiv.appendChild(loginformDiv);
    mycseDiv.appendChild(welcomeDiv);
    mycseDiv.appendChild(loginContainerDiv);
    logincontainer.appendChild(mycseDiv);

    // Use API to validate login credentials
    loginbttn.addEventListener("click", async function () {
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                alert('Invalid email or password.');
                return;
            }

            const { user } = await res.json();
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            alert('Login successful!');

            switch (user.role) {
                case 'student':
                    window.location.href = 'studentDashboard.html';
                    break;
                case 'instructor':
                    window.location.href = 'instructorDashboard.html';
                    break;
                case 'admin':
                    window.location.href = 'adminDashboard.html';
                    break;
                default:
                    alert('Unknown role.');
            }

        } catch (err) {
            console.error("Error logging in:", err);
        }
    });
});