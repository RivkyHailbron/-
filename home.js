

//timer
setTimeout(() => {
    const txt = document.createElement('h3');
    txt.innerHTML = 'לקוחות מועדון קבלו 10% הנחה עכשיו בחנות  שלנו'
    // overlay.style.display='block';
    popup.appendChild(txt);
    popup.style.display = 'block';
    document.getElementById('closePopup').addEventListener('click', function () {
        closePopupFunc();
        popup.removeChild(txt);

    })
}, 1000);
const myElement = document.getElementById('followp');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // שינוי צבע האלמנט כאשר הגלילה מתבצעת
    if (scrollY > 700) {
        myElement.style.color = 'pink';
    } else {
        myElement.style.color = 'gray';

    }
});