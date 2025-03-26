const allProducts = document.getElementById('allProducts');
const popper = document.getElementById('popper');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const popperBasket = document.getElementById('basket');
const popupBasket = document.getElementById('popupBasket');
const overlayBasket = document.getElementById('overlayBasket');
const closePopupBasket = document.getElementById('closePopupBasket');
const myBasket = document.getElementById('account');
const h2 = document.getElementById('h2');
const currentName = document.getElementById('currentName');
const myUser = sessionStorage.getItem('currentUser');
const myUserobj = JSON.parse(myUser);
currentName.innerHTML = myUserobj.name;
const usersArr = JSON.parse(localStorage.getItem('users'));
const currentUsreIndex = myUserobj.index;
const store = {
    products: []
};


$.ajax({
    url: 'Data/product.json',
    success: (data) => {
        store.products = data;
        if (allProducts != null) {
            setProducts(store.products);

        }
    }
});

//עדכון בשרת
const setLocalAndSession = (myUserobj, usersArr) => {
    localStorage.setItem('users', JSON.stringify(usersArr));
    sessionStorage.setItem('currentUser', JSON.stringify(myUserobj));
}
//לחיצה על הסל:
myBasket.onclick = () => {
    popperBasket.innerHTML = '';
    popupBasket.style.display = 'block';
    const mYamount = document.getElementById('myAmount');
    mYamount.innerHTML = myUserobj.totalSum;
    const productArrOfCurrentUser = usersArr[currentUsreIndex].productArr;
    if (!productArrOfCurrentUser) {
        const text = document.createElement('h3');
        text.innerHTML = 'הסל שלך ריק';
        popperBasket.appendChild(text);
    } else {
        productArrOfCurrentUser.forEach((product) => {
            const ProductIndex = productArrOfCurrentUser.indexOf(product);
            const productDiv = document.createElement('div');
            const productDivText = document.createElement('div');
            const BtnMinus = document.createElement('button');
            const BtnPlus = document.createElement('button');
            const conut = document.createElement('span');
            const divAdd = document.createElement('div');
            const currentProduct = store.products[Number(product.id) - 1];
            const name = document.createElement('h5');
            name.style.fontWeight = 'bold';
            const price = document.createElement('h5');
            const img = document.createElement('img');
            BtnPlus.innerHTML = '+';
            BtnMinus.innerHTML = '-';
            conut.innerHTML = product.amount;
            const garbage = document.createElement('button');
            const icon = document.createElement('img');
            icon.src = './images/icons/garbage.png';
            name.innerHTML = currentProduct.name;
            price.innerHTML = `סה"כ:${product.price}`;
            img.src = currentProduct.img;
            divAdd.append(BtnMinus, conut, BtnPlus);
            productDivText.append(name, divAdd, price);
            garbage.appendChild(icon);
            productDiv.append(img, productDivText, garbage);
            popperBasket.appendChild(productDiv);

            BtnPlus.onclick = () => {
                conut.innerHTML = Number(conut.innerHTML) + 1;
                price.innerHTML = `סה"כ:${Number(product.price) + Number(currentProduct.price)}`;
                mYamount.innerHTML = (Number(currentProduct.price) + Number(mYamount.innerHTML));
                myUserobj.totalSum = mYamount.innerHTML;
                usersArr[currentUsreIndex].totalSum += Number(currentProduct.price);
                usersArr[currentUsreIndex].productArr[ProductIndex].price += Number(currentProduct.price);
                usersArr[currentUsreIndex].productArr[ProductIndex].amount++;
                setLocalAndSession(myUserobj, usersArr);
            }
            BtnMinus.onclick = () => {
                if (Number(conut.innerHTML) > 1) {
                    conut.innerHTML = Number(conut.innerHTML) - 1;
                    price.innerHTML =`סה"כ:${(Number(product.price) - Number(currentProduct.price))}`;
                    mYamount.innerHTML = ((Number(mYamount.innerHTML)) - Number(currentProduct.price));
                    myUserobj.totalSum = mYamount.innerHTML;
                    usersArr[currentUsreIndex].totalSum -= Number(currentProduct.price);
                    usersArr[currentUsreIndex].productArr[ProductIndex].price -= Number(currentProduct.price);
                    usersArr[currentUsreIndex].productArr[ProductIndex].amount--;
                    setLocalAndSession(myUserobj, usersArr);
                }
                else {
                    productArrOfCurrentUser.splice(ProductIndex, 1);
                    popperBasket.removeChild(productDiv);
                    //עדכון יתרה לתשלום:
                    mYamount.innerHTML -= product.price;
                    usersArr[currentUsreIndex].totalSum -= product.price;
                    myUserobj.totalSum -= product.price;
                    usersArr[currentUsreIndex].productArr = productArrOfCurrentUser;
                    setLocalAndSession(myUserobj, usersArr);
                }
            }
            garbage.onclick = () => {
                //שיהיה לנו מה לעשות  מחר - יום רביעי....:)
                //מחיקת הפריט מן הסל
                productArrOfCurrentUser.splice(ProductIndex, 1);
                popperBasket.removeChild(productDiv);
                //עדכון יתרה לתשלום:
                mYamount.innerHTML -= product.price;
                usersArr[currentUsreIndex].totalSum -= product.price;
                myUserobj.totalSum -= product.price;
                usersArr[currentUsreIndex].productArr = productArrOfCurrentUser;
                setLocalAndSession(myUserobj, usersArr);
            }
        })

    }
};

closePopupBasket.onclick = () => {
    popupBasket.style.display = 'none';
}

//// חיפוש מוצרים באתר על ידי הקשת מקלדת!
const searchProducts = (query) => {
    var searchedProducts = store.products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()));
    if (searchedProducts.length < 1) {
        searchedProducts = store.products.filter(product =>
            product.englishName.toLowerCase().includes(query.toLowerCase()));
    }
    if (allProducts === null) {
        window.location.href = './orders.html';
    }
    if (searchedProducts === undefined || searchedProducts.length < 1) {
        setProducts(searchedProducts);
        h2.innerHTML = 'אין מוצרים:(';
        // allProducts.appendChild(h2);
        window.location.href = '#'
    }
    else {
        setProducts(searchedProducts);
        h2.innerHTML = '';
        window.location.href = '#'

    }
};

const searchFunc = (input) => {

    if (!input.value && allProducts != null) {
        setProducts(store.products);
        return;
    } else
        searchProducts(input.value);

};
////////////////////סינון לפי קטגוריה
const chooseCategory = document.querySelectorAll('#header2 button');
chooseCategory.forEach((e) => {
    e.onclick = () => {
        filterProduct(e.id);
        window.location.href = '#';
    }
});

const filterProduct = (category) => {
    if (category === "all") {
        setProducts(store.products);
        return;
    }
    // סינון הפריטים על פי הקטגוריה
    const filteredProducts = store.products.filter(product => product.category === category);
    // הצגת הפריטים המסוננים
    setProducts(filteredProducts);
};

//עריכת המוצרים
const setProducts = (products) => {
    allProducts.innerHTML = '';
    products.forEach((product) => {
        const productDiv = document.createElement('div');
        const img = document.createElement('img');
        const englishName = document.createElement('h3');
        const name = document.createElement('h3');
        const price = document.createElement('h4');
        const addBtn = document.createElement('button');
        const addToBasket = document.createElement('img');
        const divPrice = document.createElement('div');
        addBtn.innerHTML = 'הוסף לסל'
        addBtn.id = 'btnPress';
        addBtn.classList.add('btnPress');
        img.src = product.img; // כאן אנחנו מגדירים את ה-src של התמונה
        img.classList.add('picturesProds');
        englishName.innerHTML = `${product.englishName} `;
        name.innerHTML = `${product.name} `;
        price.innerHTML = `₪${product.price}`;
        price.id = 'price';
        price.classList.add('price');
        addToBasket.src = 'images/תמונות מתחלפות וסל/shopping-cart.gif';
        addToBasket.classList.add('Basket');
        divPrice.id = 'divPrice';
        addBtn.appendChild(addToBasket);
        //עדכון
        divPrice.appendChild(price);
        divPrice.appendChild(addBtn);
        productDiv.appendChild(img); // הוספת התמונה לפני הכותרת
        productDiv.appendChild(englishName);
        productDiv.appendChild(name);
        productDiv.appendChild(divPrice);
        allProducts.appendChild(productDiv);
        //יצירת עותק חדש ולא מצביע
        const productDivCpy = productDiv.cloneNode(true);
        //להוציא מהפונקציה
        productDiv.onclick = () => {
            const description = document.createElement('p');
            const divAdd = document.createElement('div');
            const BtnMinus = document.createElement('button');
            const BtnPlus = document.createElement('button');
            const conut = document.createElement('span');
            description.innerHTML = product.description;
            description.style.fontWeight = 'bold';
            BtnPlus.innerHTML = '+';
            BtnMinus.innerHTML = '-';
            conut.innerHTML = '1';
            divAdd.classList.add('divAdd');
            BtnMinus.classList.add('btn');
            BtnPlus.classList.add('btn');
            divAdd.append(BtnMinus, conut, BtnPlus);
            popper.appendChild(description);
            popper.appendChild(productDivCpy);
            popper.appendChild(divAdd);
            popup.style.display = 'block';
            overlay.style.display = 'block';
            const btnCpy = productDivCpy.querySelector('.btnPress');
            const price = productDivCpy.querySelector('.price');
            btnCpy.onclick = () => {
                if (usersArr[currentUsreIndex].totalSum === undefined) {
                    usersArr[currentUsreIndex].totalSum = 0;
                    myUserobj.totalSum = 0;
                }
                usersArr[currentUsreIndex].totalSum += (Number(product.price) * Number(conut.innerHTML));
                myUserobj.totalSum = String(Number(myUserobj.totalSum) + (Number(product.price) * Number(conut.innerHTML)));
                if (usersArr[currentUsreIndex].productArr === undefined) {
                    usersArr[currentUsreIndex].productArr = [];

                }
                var flag = false;
                for (let i = 0; i < usersArr[currentUsreIndex].productArr.length && (!flag); i++) {
                    ////אם כבר הזמין ממוצר זה נעדכן רק את הכמות
                    if (usersArr[currentUsreIndex].productArr[i].id === product.id) {
                        usersArr[currentUsreIndex].productArr[i].price = String(Number(usersArr[currentUsreIndex].productArr[i].price) + Number(product.price));
                        usersArr[currentUsreIndex].productArr[i].amount = String(Number(usersArr[currentUsreIndex].productArr[i].amount) + Number(conut.innerHTML));
                        flag = true;
                    }
                }
                //אם לא מצא במערך מוצר זה  יש להוסיף למערך המוצרים של משתמש זה פריט חדש בעגלה
                if (!flag) {
                    const prodObj = {
                        id: product.id,
                        price: (Number(product.price) * Number(conut.innerHTML)),
                        amount: Number(conut.innerHTML)
                    }
                    usersArr[currentUsreIndex].productArr.push(prodObj);
                }
                setLocalAndSession(myUserobj, usersArr);
                price.innerHTML = `₪${product.price}`;
                closePopupFunc();

            };
            BtnPlus.onclick = () => {
                conut.innerHTML = Number(conut.innerHTML) + 1;
                price.innerHTML = `₪${Number(product.price) * Number(conut.innerHTML)}`;

            }
            BtnMinus.onclick = () => {
                if (Number(conut.innerHTML) > 1)
                    conut.innerHTML = Number(conut.innerHTML) - 1;
                price.innerHTML = `₪${Number(product.price) * Number(conut.innerHTML)}`;
            }
            document.getElementById('closePopup').addEventListener('click', function () {
                price.innerHTML = `₪${product.price}`;
                closePopupFunc();
            });
        };

    });
};

closePopupBasket.onclick = () => {
    popupBasket.style.display = 'none';
}
const closePopupFunc = () => {
    popup.style.display = 'none';
    overlay.style.display = 'none';
    popper.innerHTML = '';
};

// search.addEventListener("input", function (e) {
//     // e.preventDefoault();
//     const query = search.input.value;
//     searchProducts(query);
// });
//לרוקן סל, לאתחל במערך המוצרים של הלקול למערך ריק ואת הסכום בנוחכי לשנות ל-0

/* burger */
let countPress = 0;
const burger = document.getElementById('burger');

burger.onclick = () => {
    if (!countPress) {
        countPress++;
        document.getElementById('menu').style.display = 'block';

    } else {
        countPress = 0;
        document.getElementById('menu').style.display = 'none';
    }
}







