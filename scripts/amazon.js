import {cart, addToCart} from "../data/cart.js"; 
import {products} from "../data/products.js";


let productsHTML = "";


products.forEach((product) => {
    productsHTML += `
        <div class="product-container">
            <div class="product-image-container">
                <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
                ${product.name}
            </div>

            <div class="product-rating-container">
                <img class="product-rating-stars"
                src="images/ratings/rating-${product.rating.stars * 10}.png">
                <div class="product-rating-count link-primary">
                ${product.rating.count}
                </div>
            </div>

            <div class="product-price">
                $${(product.priceCents / 100).toFixed(2)}
            </div>

            <div class="product-quantity-container">
                <select class="js-quantity-selector">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                </select>
            </div>

            <div class="product-spacer"></div>

            <div class="added-to-cart">
                <img src="images/icons/checkmark.png">
                Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart"
                data-product-name="${product.name}" data-product-id="${product.id}">
                Add to Cart
            </button>
            </div>
    `;
})


function updateCart() {
    let cartElement = document.querySelector(".cart-quantity");
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
        
    });
    cartElement.innerHTML = cartQuantity;
            
}

document.querySelector(".js-products-grid").innerHTML = productsHTML;

updateCart();

document.querySelectorAll(".js-add-to-cart")
    .forEach((button) => {
        button.addEventListener("click", () => {
            const productName = button.dataset.productName;
            const productId = button.dataset.productId;
            
            // Get the selected quantity from the nearby select dropdown
            const quantitySelector = button.parentElement.querySelector(".js-quantity-selector");
            const selectedQuantity = parseInt(quantitySelector.value);
            
            // Add to cart the selected quantity of times
            for (let i = 0; i < selectedQuantity; i++) {
                addToCart(productId);
            }
            updateCart();
          
        })
    })
