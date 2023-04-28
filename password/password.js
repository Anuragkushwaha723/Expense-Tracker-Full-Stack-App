async function submitInfo(e) {
    try {
        e.preventDefault();
        const emailId = e.target.email.value;
        let data = await axios.post('http://localhost:3000/password/forgotpassword', { emailId: emailId });

    } catch (error) {
        let errorElement = document.getElementById('error');
        if (error.response === undefined) {
            errorElement.innerHTML = `<p id="errorChild" class="m-3" style="color:red">${error.message}</p>`;
        } else {
            errorElement.innerHTML = `<p id="errorChild" class="m-3" style="color:red">${error.response.data.message}</p>`;
        }
    }
}