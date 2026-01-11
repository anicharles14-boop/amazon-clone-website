import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {cart, removeFromCart} from "../data/cart.js";
import {products} from "../data/products.js"; 
import {deliveryOptions} from "../data/deliveryOptions.js";

function updateDeliveryOption(productId, deliveryOptionId) {
  let cartItem = cart.find(item => item.productId === productId);
  if (cartItem) {
    cartItem.deliveryOptionId = deliveryOptionId;
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update the delivery date at the top of the item
    const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");
    
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const deliveryDateElement = container.querySelector(".delivery-date");
    deliveryDateElement.textContent = `Delivery date: ${dateString}`;
    
    // Update the payment summary
    updatePaymentSummary();
    updateCartQuantityDisplay();
  }
}

let cartSummaryHTML = ""
cart.forEach((cartItem)=>{
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId){
      matchingProduct = product;
    }
  })

  const deliveryOptionId = cartItem.deliveryOptionId;
  let deliveryOption;

  deliveryOptions.forEach((option)=>{
    if (option.id === deliveryOptionId){
      deliveryOption = option;
    }
  })
  const today = dayjs();
  const deliveryDate = today.add(
    deliveryOption.deliveryDays,"days"
  );
  const dateString = deliveryDate.format(
    "dddd, MMMM D"
  )

  cartSummaryHTML += `
    <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${(matchingProduct.priceCents / 100).toFixed(2)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
          
        </div>
      </div>
    </div>
  `;

});

function deliveryOptionsHTML(matchingProduct, cartItem){
  let html = ""

  deliveryOptions.forEach((deliveryOption)=>{
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,"days"
    );
    const dateString = deliveryDate.format(
      "dddd, MMMM D"
    )
    const priceString = deliveryOption.priceCents === 0 
      ? "FREE"
      : `$${(deliveryOption.priceCents / 100).toFixed(2)}`

    const isChecked = deliveryOption.id === 
    cartItem.deliveryOptionId
    html += `
      <div class="delivery-option">
        <input type="radio"
          ${isChecked ? "checked" : ""} 
          class="delivery-option-input js-delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </div>
    `
  })
  return html;
}

document.querySelector(".js-order-summary")
  .innerHTML = cartSummaryHTML;

updatePaymentSummary();
updateCartQuantityDisplay();

function updateCartQuantityDisplay() {
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Update the header checkout link
  document.querySelector('.return-to-home-link').textContent = `${cartQuantity} items`;
  
  // Update the payment summary items count
  const paymentRows = document.querySelectorAll('.payment-summary-row');
  if (paymentRows.length > 0) {
    paymentRows[0].querySelector('div:first-child').textContent = `Items (${cartQuantity}):`;
  }
}

function updatePaymentSummary() {
  let itemsTotal = 0;
  let shippingTotal = 0;

  cart.forEach((cartItem) => {
    const matchingProduct = products.find(product => product.id === cartItem.productId);
    itemsTotal += matchingProduct.priceCents * cartItem.quantity;

    const deliveryOption = deliveryOptions.find(option => option.id === cartItem.deliveryOptionId);
    shippingTotal += deliveryOption.priceCents;
  });

  const totalBeforeTax = itemsTotal + shippingTotal;
  const tax = totalBeforeTax * 0.1;
  const orderTotal = totalBeforeTax + tax;

  document.querySelector('.payment-summary-money').textContent = `$${(itemsTotal / 100).toFixed(2)}`;
  document.querySelectorAll('.payment-summary-money')[1].textContent = `$${(shippingTotal / 100).toFixed(2)}`;
  document.querySelectorAll('.payment-summary-money')[2].textContent = `$${(totalBeforeTax / 100).toFixed(2)}`;
  document.querySelectorAll('.payment-summary-money')[3].textContent = `$${(tax / 100).toFixed(2)}`;
  document.querySelectorAll('.payment-summary-money')[4].textContent = `$${(orderTotal / 100).toFixed(2)}`;
}

document.querySelectorAll(".js-delivery-option-input")
.forEach((input) => {
  input.addEventListener("change", () => {
    const productId = input.dataset.productId;
    const deliveryOptionId = input.dataset.deliveryOptionId;
    updateDeliveryOption(productId, deliveryOptionId);
  })
})

document.querySelectorAll(".js-delete-link")
.forEach((link) => {
  link.addEventListener("click",()=>{
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
    
    updatePaymentSummary();
    updateCartQuantityDisplay();
  })
});

document.querySelectorAll(".js-update-quantity-link")
.forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const quantityLabel = container.querySelector(".quantity-label");
    const currentQuantity = parseInt(quantityLabel.textContent);
    
    const selectHTML = `
      <select class="quantity-selector js-quantity-selector" data-product-id="${productId}">
        <option value="1" ${currentQuantity === 1 ? "selected" : ""}>1</option>
        <option value="2" ${currentQuantity === 2 ? "selected" : ""}>2</option>
        <option value="3" ${currentQuantity === 3 ? "selected" : ""}>3</option>
        <option value="4" ${currentQuantity === 4 ? "selected" : ""}>4</option>
        <option value="5" ${currentQuantity === 5 ? "selected" : ""}>5</option>
        <option value="6" ${currentQuantity === 6 ? "selected" : ""}>6</option>
        <option value="7" ${currentQuantity === 7 ? "selected" : ""}>7</option>
        <option value="8" ${currentQuantity === 8 ? "selected" : ""}>8</option>
        <option value="9" ${currentQuantity === 9 ? "selected" : ""}>9</option>
        <option value="10" ${currentQuantity === 10 ? "selected" : ""}>10</option>
      </select>
    `;
    
    quantityLabel.innerHTML = selectHTML;
    
    const selector = container.querySelector(".js-quantity-selector");
    selector.addEventListener("change", () => {
      const newQuantity = parseInt(selector.value);
      const cartItem = cart.find(item => item.productId === productId);
      if (cartItem) {
        cartItem.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        quantityLabel.textContent = newQuantity;
        updatePaymentSummary();
        updateCartQuantityDisplay();
      }
    });
  })
});

document.querySelector('.place-order-button').addEventListener('click', () => {
  // Save current cart as the order to track
  localStorage.setItem('trackingOrder', JSON.stringify(cart));
  
  // Clear the cart
  cart.length = 0;
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Redirect to tracking page
  window.location.href = 'tracking.html';
});