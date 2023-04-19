async function submitUserInfo(e) {
    try {
        e.preventDefault();
        let userInfo = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        let responseData = await axios.post('http://localhost:3000/user/signUp', userInfo);

        if (responseData.status === 201) {
            document.location.href = './login/login.html'; //change signup page to login page
        }
    } catch (error) {
        let err = document.getElementById('error');
        err.innerHTML = `<p id="removeError" style="color:red">${error.response.data.message}</p>`
        // setTimeout(() => {
        //     err.removeChild(document.getElementById('removeError'));
        // }, 5000);
    }
}