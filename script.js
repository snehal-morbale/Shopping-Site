let productDiv = document.querySelector(".product");
let categoryListDiv = document.querySelector(".categoryList");
let allCatName = [];

let displayProduct = async (allCheckCat = [], searchText = '') => {
    productDiv.innerHTML = '';

    let product = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
    let finalProduct = await product.json();

    finalProduct?.categories.forEach((element) => {
        if (!allCatName.includes(element.category_name)) {
            categoryListDiv.innerHTML += ` <label>
                <input type="checkbox" onclick='categoryFilter()' value="${element.category_name}"> &nbsp; ${element.category_name}
            </label>`
            allCatName.push(element.category_name)
        }

        if (allCheckCat.length == 0 || allCheckCat.includes(element.category_name)) {
            element.category_products.forEach((item) => {
                if (item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.vendor.toLowerCase().includes(searchText.toLowerCase())) {
                    // Create product item
                    let productItem = document.createElement('div');
                    productItem.classList.add('productItems');

                    // Populate product item with details and "Add to Cart" button
                    productItem.innerHTML = `
                        <img src=${item.image}>
                        <h6>${item.vendor}</h6>
                        <hr/>
                        <h6>${item.badge_text === null ? "" : item.badge_text}</h6>
                        <h6>Price Rs. ${item.price} | <span>${item.compare_at_price}</span></h6>
                        <h5>${item.title}</h5>
                        <button class="add-to-cart-btn" onclick="addToCart('${item.title}', ${item.price})">Add to Cart</button>
                    `;

                    // Append product item to productDiv
                    productDiv.appendChild(productItem);
                }
            });
        }
    });
}

displayProduct();

let categoryFilter = () => {
    let checkInput = document.querySelectorAll("input[type='checkbox']");
    let checkdata = [];
    checkInput.forEach((element) => {
        if (element.checked) {
            checkdata.push(element.value);
        }
    });
    displayProduct(checkdata, document.getElementById('searchInput').value);
}

document.getElementById('searchInput').addEventListener('input', () => {
    categoryFilter();
});

function addToCart(productTitle, productPrice) {
    // Get the current cart items from local storage or initialize an empty array
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Add the new item to the cart
    let newItem = {
        title: productTitle,
        price: productPrice
    };
    cartItems.push(newItem);

    // Store the updated cart items back to local storage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Redirect to the cart page
    window.location.href = 'cart.html'; // Replace 'cart.html' with your cart page URL
}
