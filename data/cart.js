export let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

loadCart();

export function addToCart(productId) {
    const existingItem = cart.find(cartItem => cartItem.productId === productId);

    if (existingItem) {
        // If the item exists, update the quantity
        existingItem.quantity++;
    } else {
        // If the item doesn't exist, add it to the cart
        cart.push({
            productId: productId,
            quantity:1,
            deliveryOptionId:"1"
        });
    }
    saveCart();
}

export function removeFromCart(productId){
    let newCart = [];
    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId){
            newCart.push(cartItem)
        }
    })

    cart = newCart;
    saveCart();
}
