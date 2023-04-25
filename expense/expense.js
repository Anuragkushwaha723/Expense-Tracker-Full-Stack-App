const itemList = document.getElementById('itemList');
let token = localStorage.getItem('token');
window.addEventListener('DOMContentLoaded', async () => {
    try {
        let decodedToken = parseJwt(token);
        let ispremiumuser = decodedToken.ispremiumuser;
        if (ispremiumuser === true) {
            premiumStatusMessage();
            leaderBoardButton();
        }
        let responseData = await axios.get('http://localhost:3000/expense/get-expense', { headers: { 'Authorization': token } });
        if (responseData.status === 201) {
            for (let i = 0; i < responseData.data.length; i++) {
                showOutput(responseData.data[i]);
            }
        }
    } catch (error) {
        errorMessage(error);
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
        errorMessage(error);
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
        errorMessage(error);
    }
}

document.getElementById('rzp-button1').onclick = async function (e) {
    let response = await axios.get('http://localhost:3000/purchase/purchasemembership', { headers: { 'Authorization': token } });
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            let respData = await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { 'Authorization': token } });
            premiumStatusMessage();
            leaderBoardButton();
            localStorage.setItem('token', respData.data.token);
            alert("You are a premium user now");
        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    rzp1.on('payment.failed', async function (response) {
        await axios.post('http://localhost:3000/purchase/failedtransactionstatus', {
            order_id: options.order_id,
        }, { headers: { 'Authorization': token } });
        alert('Something went wrong');
    })
};
function errorMessage(error) {
    let errorElement = document.getElementById('error');
    if (error.response === undefined) {
        errorElement.innerHTML = `<p id="errorChild" style="color:red">${error.message}</p>`;
    } else {
        errorElement.innerHTML = `<p id="errorChild" style="color:red">${error.response.data.message}</p>`;
    }
    setTimeout(() => {
        errorElement.removeChild(document.getElementById('errorChild'));
    }, 2000);
}
function premiumStatusMessage() {
    let userTitle = document.getElementById('userPremiumTitle');
    userTitle.innerHTML = "You are a premium user";
    let rzpButton = document.getElementById('rzp-button1');
    rzpButton.style.visibility = 'hidden';
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function leaderBoardButton() {
    let userTitle = document.getElementById('userPremiumTitle');
    userTitle.innerHTML = userTitle.innerHTML + `<button id="showLeaderboardId" class="btn btn-outline-success m-2">Show Leaderboard</button>`
    document.getElementById('showLeaderboardId').onclick = async function (e) {
        try {
            e.preventDefault();
            let responseData = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: { 'Authorization': token } });
            leaderboardHeading();
            initialLeaderBoardScreenClean();
            for (let i = 0; i < responseData.data.length; i++) {
                showLeaderBoardScreen(responseData.data[i]);
            }
        } catch (error) {
            errorMessage(error);
        }
    };
}
function leaderboardHeading() {
    let leaderHeading = document.getElementById('leaderboardheading');
    leaderHeading.innerHTML = `<h2 class="fs-2 mb-3 m-3 text-dark">Leaderboard</h2>`;
}
function initialLeaderBoardScreenClean() {
    let leaderList = document.getElementById('leaderboardLists');
    leaderList.innerHTML = '';
}
function showLeaderBoardScreen(data) {
    let leaderList = document.getElementById('leaderboardLists');
    leaderList.innerHTML += `<li  class="m-1">Name - ${data.name} , Total Expense - ${data.totalExpense}</li>`;
}