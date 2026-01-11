import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {products} from "../data/products.js";
import {deliveryOptions} from "../data/deliveryOptions.js";

const trackingOrder = JSON.parse(localStorage.getItem('trackingOrder')) || [];

let trackingHTML = '';

if (trackingOrder.length === 0) {
  trackingHTML = '<p>No order to track.</p>';
} else {
  trackingHTML += `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
  `;
  
  trackingOrder.forEach((orderItem) => {
    const product = products.find(p => p.id === orderItem.productId);
    const deliveryOption = deliveryOptions.find(d => d.id === orderItem.deliveryOptionId);
    
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    
    // Check if delivered
    const isDelivered = today.isAfter(deliveryDate) || today.isSame(deliveryDate, 'day');
    const currentStatus = isDelivered ? 'Delivered' : 'Shipped';
    const progressWidth = isDelivered ? '100%' : '50%';
    
    trackingHTML += `
      <div class="order-tracking">
        <div class="delivery-date">
          Arriving on ${dateString}
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Quantity: ${orderItem.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label">
            Preparing
          </div>
          <div class="progress-label ${isDelivered ? '' : 'current-status'}">
            Shipped
          </div>
          <div class="progress-label ${isDelivered ? 'current-status' : ''}">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progressWidth};"></div>
        </div>
      </div>
    `;
  });
}

document.querySelector('.js-order-tracking').innerHTML = trackingHTML;

// Update cart quantity display
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
document.querySelector('.cart-quantity').textContent = cartQuantity;