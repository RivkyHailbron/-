
const usersList = {
    users: []
};
$.ajax({
    url: 'Data/users.json',
    success: (data) => {
        usersList.users = data;
    }
})
const login = document.querySelector('form');

login.onsubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const currentUser = Object.fromEntries([...form.entries()]);
    usersList.users = JSON.parse(localStorage.getItem("users")) ? JSON.parse(localStorage.getItem("users")) : [];

    if ((usersList.users.find((user) => user.password === currentUser.password && user.email != currentUser.email))) {
        alert('יש כבר סיסמא כזו');
        login.password.value = "";
        //return;
    } else {
        if ((usersList.users.find((user) => user.password === currentUser.password && user.email === currentUser.email))) {
            window.location.href = './home.html';
            alert('ברןך הבא:' + currentUser.name)
            let index1 = 0;
            for (let i = 0; i < usersList.users.length; i++) {
                if (usersList.users[i].password === currentUser.password) {
                    break;
                } else
                    index1++;
            }
            // currentUser.index=0;
            currentUser.index = index1;
        } else {
            currentUser.totalSum = 0;
            // currentUser.totalSum = '0';
            currentUser.index = 0;
            currentUser.index = usersList.users.length;
            usersList.users.push(currentUser);
            localStorage.setItem("users", JSON.stringify(usersList.users));
            alert("נרשמת בהצלחה!");
        }
        window.location.href = './home.html';

    };
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
};























