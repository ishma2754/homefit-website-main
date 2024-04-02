
import { shopItemsData } from "./data/data.js";
import formatCurrency from "./utils/money.js";




let shop = document.getElementById('shop');

let basket = JSON.parse(localStorage.getItem('data')) || []; 


let generateShop = () => {
  return (shop.innerHTML = shopItemsData.map((x) => {
    let {id, name, priceCents, desc, img, deliveryOptionId} = x;
    let search = basket.find((x) => x.id === id) || [];

    

    return `
      <div id=product-id-${id} class="item">
        <img width="220" src=${img} alt="">
        <div class="details">
          <h3>${name}</h3>
          <p>${desc}</p>
          <div class="price-quantity">
            <h2>$ ${formatCurrency(priceCents)}</h2>
            <div class="buttons">
              <i data-id=${id} data-deliveryOptionId=${deliveryOptionId}  class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${search.item === undefined ? 0: search.item}</div>
              <i data-id=${id} data-deliveryOptionId=${deliveryOptionId} class="bi bi-plus-lg"></i>
            </div>
          </div>

        </div>
      </div>
    `
  }).join(''));
};
generateShop();

shop.addEventListener('click', (event) => {
  if (event.target.classList.contains('bi-plus-lg')) {
    let id = event.target.getAttribute('data-id');
    let deliveryOptionId = event.target.getAttribute('data-deliveryOptionId');
    increment(id, deliveryOptionId);
  }
 
  if (event.target.classList.contains('bi-dash-lg')) {
    let id = event.target.getAttribute('data-id');
    let deliveryOptionId = event.target.getAttribute('data-deliveryOptionId'); 
    decrement(id, deliveryOptionId);
  }
});


let increment = (id, deliveryOptionId) =>{
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem );

  
  if (search === undefined ) {
    
    basket.push({
      id: selectedItem,
      item: 1,
      deliveryOptionId: deliveryOptionId

    });
  } else{
    search.item += 1;
  }


  update(selectedItem);
  localStorage.setItem('data', JSON.stringify(basket));
};

let decrement = (id, deliveryOptionId) =>{
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }

  update(selectedItem);
  basket = basket.filter((x) => x.item !== 0);
 
  localStorage.setItem('data', JSON.stringify(basket));
};

let update = (id, deliveryOptionId) =>{
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML =  search.item;
  calculation();
};

let calculation = () => {
  let cartIcon = document.getElementById('cartAmount');
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);//get only item
  };

  calculation();

 

