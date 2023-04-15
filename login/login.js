async function submitUserInfo(e) {
    try {
        e.preventDefault();
        let userInfo = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        let responseData = await axios.post('http://localhost:3000/user/login', userInfo);
        if (responseData.status === 201) {
            window.alert(responseData.data.message); //change signup page to login page
        } else {
            console.log(responseData);
            throw new Error({ message: responseData.data.message });
        }
    } catch (error) {
        let err = document.getElementById('error');
        err.innerHTML = `<p id="removeError" style="color:red">${error.response.data.message}</p>`;
        // setTimeout(() => {
        //     err.removeChild(document.getElementById('removeError'));
        // }, 5000);
    }
}