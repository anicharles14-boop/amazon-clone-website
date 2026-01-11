import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {products} from "../data/products.js";
import {deliveryOptions} from "../data/deliveryOptions.js";

const trackingOrder = JSON.parse(localStorage.getItem('trackingOrder')) || [];

let ordersHTML = '';

if (trackingOrder.length > 0) {
  // Calculate total
  let itemsTotal = 0;
  let shippingTotal = 0;

  trackingOrder.forEach((orderItem) => {
    const product = products.find(p => p.id === orderItem.productId);
    itemsTotal += product.priceCents * orderItem.quantity;

    const deliveryOption = deliveryOptions.find(d => d.id === orderItem.deliveryOptionId);
    shippingTotal += deliveryOption.priceCents;
  });

  const totalBeforeTax = itemsTotal + shippingTotal;
  const tax = totalBeforeTax * 0.1;
  const orderTotal = totalBeforeTax + tax;

  // Generate order ID (simple random)
  const orderId = 'order-' + Math.random().toString(36).substr(2, 9);

  // Order date
  const orderDate = dayjs().format('MMMM D');

  // Generate product details
  let productDetailsHTML = '';
  trackingOrder.forEach((orderItem) => {
    const product = products.find(p => p.id === orderItem.productId);
    const deliveryOption = deliveryOptions.find(d => d.id === orderItem.deliveryOptionId);
    
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('MMMM D');

    productDetailsHTML += `
      <div class="product-image-container">
        <img src="${product.image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${dateString}
        </div>
        <div class="product-quantity">
          Quantity: ${orderItem.quantity}
        </div>
      </div>

      <div class="product-actions">
        <a href="tracking.html">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  });

  ordersHTML += `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${orderDate}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${(orderTotal / 100).toFixed(2)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${orderId}</div>
        </div>
      </div>

      <div class="order-details-grid">
        ${productDetailsHTML}
      </div>
    </div>
  `;
} else {
  ordersHTML = '<p>No orders yet.</p>';
}

document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

// Update cart quantity
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
document.querySelector('.cart-quantity').textContent = cartQuantity;