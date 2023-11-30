const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const passwordInput = document.querySelector('input[name="password"]');
const submitButton = document.querySelector('button[type="submit"]');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});


passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const isPasswordValid = password.length >= 8; 

    if (isPasswordValid) {
        submitButton.removeAttribute('disabled');
    } else {
        submitButton.setAttribute('disabled', 'true');
    }
});