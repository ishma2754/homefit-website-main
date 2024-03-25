import { shopItemsData } from "./data.js";
import {formatCurrency, formatNumber } from "./utils/money.js";
let label = document.getElementById('label');

let shoppingCart = document.getElementById('shopping-cart');

let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();


let generateCartItems = () => {
 if(basket.length !==0) {
   return (shoppingCart.innerHTML = basket.map((x) => {
      let {id, item} = x;
      let search = shopItemsData.find((y) => y.id === id) || [];
      let {img, name, priceCents} = search;
      let itemPrice = formatCurrency(priceCents); 
      let totalPrice = formatNumber(item * itemPrice); 
      return `
      <div class="cart-item">
        <div class="image">
          <img width="60" height="137" src="${img}" alt="">
        </div>
        <div>
          <div class="details">
            <div class="title-price-x">
              <h4 class="title-price">
                <p>${name}</p>
              </h4>
              <i data-id=${id} class="bi bi-x-lg"></i>
            </div>

            <div>
            <p class="cart-item-price">$${formatCurrency(priceCents)}</p>
            </div>

            

            <div class="buttons">
              <i data-id=${id} class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${item}</div>
              <i data-id=${id} class="bi bi-plus-lg"></i>
            </div>

            <h3>$${totalPrice}</h3>
          </div>
        </div>  

        <div class="delivery">
          <div class="delivery-date">
            Delivery date: Thursday, September 12
          </div>
          <div class="delivery-option js-delivery-option" data-product-id="e43638ce-6aa0-4b85-b27f-e1d07eb678c6" data-delivery-option-id="2">
          <input type="radio" class="delivery-option-input" name="delivery-option-e43638ce-6aa0-4b85-b27f-e1d07eb678c6">
          <div>
            <div class="delivery-option-date">
              Thursday, March 28
            </div>
            <div class="delivery-option-price">
            $4.99
            </div>
          </div>
        </div>

      <div class="delivery-option js-delivery-option" data-product-id="e43638ce-6aa0-4b85-b27f-e1d07eb678c6" data-delivery-option-id="2">
        <input type="radio" class="delivery-option-input" name="delivery-option-e43638ce-6aa0-4b85-b27f-e1d07eb678c6">
        <div>
          <div class="delivery-option-date">
            Thursday, March 28
          </div>
          <div class="delivery-option-price">
          FREE
          </div>
        </div>
      </div>
    </div>

      </div>
      `;
   }).join(''));
 } else{
   shoppingCart.innerHTML = ``;
   label.innerHTML = `
   <h2>Cart is Empty</h2>
   <a href="index.html">
    <button class="HomeBtn">Back to home</button>
   </a>
   `;
 }
};

generateCartItems();

shoppingCart.addEventListener('click', (event) => {
  if (event.target.classList.contains('bi-plus-lg')) {
    let id = event.target.getAttribute('data-id');
    increment({id});
  }
 
  if (event.target.classList.contains('bi-dash-lg')) {
    let id = event.target.getAttribute('data-id');
    decrement({id});
  }

  if (event.target.classList.contains('bi-x-lg')) {
    let id = event.target.getAttribute('data-id');
    removeItem({id});
  }
});


document.addEventListener('click', (event) => {
  if (event.target.classList.contains('removeAll')) {
    clearCart();
  }
});

let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  generateCartItems();
  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();//re render our cart
  localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  // console.log(search.item);
  document.getElementById(id).innerHTML = search.item;
  calculation();
  TotalAmount();
};

//when removeItem is invoked with a specific id, it removes the item with that id from the basket array.
//reassigns basket to a new array that is returned by the filter method. The filter method goes through each item x in the basket array and includes it in the new array only if x.id does not equal selectedItem.id. In other words, it filters out the item with the id that matches selectedItem.id.
//he splice method is not used in the provided code for removing items from the array because splice modifies the original array, which can lead to side effects if the original array needs to be preserved or if the operation needs to be pure (without side effects).

//In contrast, the filter method creates a new array based on the condition provided and does not modify the original array. This approach is often preferred in functional programming paradigms where immutability is a key principle. By using filter, the code avoids direct mutations to the state, which can help prevent bugs and make the code easier to understand and maintain.
//Moreover, when using splice, if the item to be removed is not found, splice could potentially remove the wrong item (if not handled correctly), whereas filter will simply return a new array that doesn’t include any items that don’t meet the condition, making it a safer choice in this context1.
//In summary, filter is used over splice in the provided code to ensure immutability of the array and to avoid potential side effects of modifying the original array directly.

let removeItem = (id) => {
  let selectedItem = id;
  basket = basket.filter((x) => x.id !== selectedItem.id);
  generateCartItems();
  TotalAmount();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
  basket = [];
  generateCartItems();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket));
};

let TotalAmount = () => {
  if (basket.length !==0){
    //we will go to datajs and grab the price
    let amount = basket.map((x) => {
      let {item, id} = x;
      let search = shopItemsData.find((y) => y.id === id) || [];

      return item * (search.priceCents / 100);
    })
      .reduce((x, y) => x + y, 0 );
    label.innerHTML = `
    <h2>Total Bill : $ ${formatNumber(amount)}</h2>
    <button class="checkout">Checkout</button>
    <button  class="removeAll">Clear Cart</button>
    `;
    } else return;
};

TotalAmount();
