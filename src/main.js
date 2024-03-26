
import { shopItemsData } from "./data.js";
import formatCurrency from "./utils/money.js";
let shop = document.getElementById('shop');

let basket = JSON.parse(localStorage.getItem('data')) || [{
  id: 'jjjj',
  item: 1,
  deliveryOptionId: '1'
}, {
  id: 'kkkk',
  item: 2,
  deliveryOptionId: '2'
}]; 


let generateShop = () => {
  return (shop.innerHTML = shopItemsData.map((x) => {
    let {id, name, priceCents, desc, img} = x;
    let search = basket.find((x) => x.id === id) || [];//for local storage
    return `
      <div id=product-id-${id} class="item">
        <img width="220" src=${img} alt="">
        <div class="details">
          <h3>${name}</h3>
          <p>${desc}</p>
          <div class="price-quantity">
            <h2>$ ${formatCurrency(priceCents)}</h2>
            <div class="buttons">
              <i data-id=${id}  class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${search.item === undefined ? 0: search.item}</div>
              <i data-id=${id} class="bi bi-plus-lg"></i>
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
    increment({ id });
  }
 
  if (event.target.classList.contains('bi-dash-lg')) {
    let id = event.target.getAttribute('data-id');
    decrement({id});
  }
});


let increment = (id) =>{
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);
  
  if (search === undefined ) {
    
    basket.push({
      id: selectedItem.id,
      item: 1,
      deliveryOptionId: '1'
    });
  } else{
    search.item += 1;
  }


  update(selectedItem.id);
  localStorage.setItem('data', JSON.stringify(basket));
};

let decrement = (id) =>{
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }

  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);
 
  localStorage.setItem('data', JSON.stringify(basket));
};

let update = (id) =>{
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML =  search.item;
  calculation();
};

let calculation = () => {
  let cartIcon = document.getElementById('cartAmount');
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);//get only item
  };

  calculation();

 

