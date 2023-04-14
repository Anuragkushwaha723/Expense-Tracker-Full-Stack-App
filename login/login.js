async function submitUserInfo(e) {
    try {
        e.preventDefault();
        let userInfo = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        let responseData = await axios.post('http://localhost:3000/user/login', userInfo);

        if (responseData.status === 201) {
            window.alert('User logged in successfully'); //change signup page to login page
        } else {
            throw new Error('Failed to Login');
        }
    } catch (error) {
        let err = document.getElementById('error');
        err.innerHTML = `<p id="removeError" style="color:red">${error}</p>`;
        // setTimeout(() => {
        //     err.removeChild(document.getElementById('removeError'));
        // }, 5000);
    }
}