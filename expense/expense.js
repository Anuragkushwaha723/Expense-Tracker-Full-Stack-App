const itemList = document.getElementById('itemList');
let token = localStorage.getItem('token');
window.addEventListener('DOMContentLoaded', async () => {
    try {
        let responseData = await axios.get('http://localhost:3000/expense/get-expense', { headers: { 'Authorization': token } });
        if (responseData.status === 201) {
            for (let i = 0; i < responseData.data.length; i++) {
                showOutput(responseData.data[i]);
            }
        }
    } catch (error) {
        let errorElement = document.getElementById('error');
        errorElement.innerHTML = `<p id="errorChild" style="color:red">${error.response.data.message}</p>`;
        setTimeout(() => {
            errorElement.removeChild(document.getElementById('errorChild'));
        }, 2000);
    }
})
async function submitExpense(e) {
    try {
        e.preventDefault();
        let newAmount = + e.target.amount.value;
        const expenseDetails = {
            amount: newAmount,
            description: e.target.description.value,
            category: e.target.category.value
        };
        let responseData = await axios.post('http://localhost:3000/expense/add-expense', expenseDetails, { headers: { 'Authorization': token } });
        if (responseData.status === 201) {
            showOutput(responseData.data);
        }
    } catch (error) {
        let errorElement = document.getElementById('error');
        errorElement.innerHTML = `<p id="errorChild" style="color:red">${error.response.data.message}</p>`;
        setTimeout(() => {
            errorElement.removeChild(document.getElementById('errorChild'));
        }, 2000);
    }
};

function showOutput(data) {
    let li = document.createElement('li');
    li.className = "m-1";
    li.id = data.id;
    let text1 = document.createTextNode(`${data.amount} - ${data.description} - ${data.category} `);
    li.append(text1);
    let button = document.createElement('button');
    let text2 = document.createTextNode('Delete');
    button.className = "btn btn-outline-danger m-1";
    button.append(text2);
    button.onclick = function () {
        removefromscreen(data);
    }
    li.append(button);
    itemList.append(li);
}

async function removefromscreen(data) {
    try {
        let responseData = await axios.delete(`http://localhost:3000/expense/delete-expense/${data.id}`, { headers: { 'Authorization': token } });
        if (responseData.status === 201) {
            itemList.removeChild(document.getElementById(responseData.data));
        }
    } catch (error) {
        let errorElement = document.getElementById('error');
        errorElement.innerHTML = `<p id="errorChild" style="color:red">${error.response.data.message}</p>`;
        setTimeout(() => {
            errorElement.removeChild(document.getElementById('errorChild'));
        }, 2000);
    }
}

document.getElementById('rzp-button1').onclick = async function (e) {
    let response = await axios.get('http://localhost:3000/purchase/purchasemembership', { headers: { 'Authorization': token } });
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { 'Authorization': token } });
            alert("You are now a premium user");
        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    rzp1.on('payment.failed', function (response) {
        alert('Something went wrong');
    })
};