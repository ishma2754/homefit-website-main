
import { shopItemsData } from "./data/data.js";
import {formatCurrency, formatNumber } from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from "./data/deliveryOptions.js";


const today = dayjs();
const deliveryDate = today.add(7, 'days');
deliveryDate.format('dddd, MMMM D');



let label = document.getElementById('label');

let shoppingCart = document.getElementById('shopping-cart');

let basket = JSON.parse(localStorage.getItem('data')) ||  [];






let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();


let generateCartItems = () => {
 if(basket.length !==0) {
   return (shoppingCart.innerHTML = basket.map((x) => {
      let {id, item, deliveryOptionId} = x;
      let search = shopItemsData.find((y) => y.id === id) || [];
      let {img, name, priceCents, priceCentsDelivery} = search;
      let itemPrice = formatCurrency(priceCents); 
      let totalPrice = formatNumber(item * itemPrice); 

      let deliveryOption;

      deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
          deliveryOption = option;
        }
      });

      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays, 
        'days'
      );

      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

      const priceString = deliveryOption.priceCentsDelivery 
      === 0
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.priceCentsDelivery)}`;

      
    


      return `
      <div class="cart-item">

            <div class="image div1">
                  <img width="60" height="137" src="${img}" alt="">
            </div>



              


            <div class="div2">
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

            <div class="delivery div3">

                  <div class="delivery-date" data-id=${id}>
                     <span>Delivery Date:</span> ${dateString} <span2>${priceString}</span2>- Shipping
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
    increment(id);
  }
 
  if (event.target.classList.contains('bi-dash-lg')) {
    let id = event.target.getAttribute('data-id');
    decrement(id);
  }

  if (event.target.classList.contains('bi-x-lg')) {
    let id = event.target.getAttribute('data-id');
    removeItem(id);
  }
});


document.addEventListener('click', (event) => {
  if (event.target.classList.contains('removeAll')) {
    clearCart();
  }
});

let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem);

  if (search === undefined) {
    basket.push({
      id: selectedItem,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  generateCartItems();
  update(selectedItem);
  localStorage.setItem("data", JSON.stringify(basket));
};
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem);
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
  basket = basket.filter((x) => x.id !== selectedItem);
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

      let shippingCharges = basket.map((x) => {
        let { item, id, deliveryOptionId } = x;
        let search = deliveryOptions.find((y) => y.id === deliveryOptionId) || {};
        return  search.priceCentsDelivery / 100;
      }).reduce((x, y) => x + y, 0 );

      let totalAmount = amount + shippingCharges;

    label.innerHTML = `
    <h2>Total Bill : $${formatNumber(totalAmount)}</h2>
    <h3>Shipping Charges : $${formatNumber(shippingCharges)}</h3>
    <button class="checkout">Checkout</button>
    <button  class="removeAll">Clear Cart</button>
    `;
    } else return;
};

TotalAmount();


