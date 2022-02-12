let modalQt = 1;
let modalKey = 0;
let cart = [];
const elemento = (el)=>document.querySelector(el);
const elementosTotais = (el)=>document.querySelectorAll(el);

pizzaJson.map((item, index)=>{
  let pizzaItem = elemento('.models .pizza-item').cloneNode(true);
  pizzaItem.setAttribute('data-key', index)
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaItem.querySelector('a').addEventListener('click', (e)=>{
    e.preventDefault();
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalKey = key;
    modalQt = 1;
    elemento('.pizzaBig img').src = pizzaJson[key].img
    elemento('.pizzaInfo h1').innerHTML = pizzaJson[key].name
    elemento('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
    elemento('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
    elemento('.pizzaInfo--size.selected').classList.remove('selected');
    elementosTotais('.pizzaInfo--size').forEach((size,sizeIndex)=>{
      if(sizeIndex==2){
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });
    elemento('.pizzaInfo--qt').innerHTML = modalQt;
    elemento('.pizzaWindowArea').style.opacity = 0;
    elemento('.pizzaWindowArea').style.display = 'flex';
    setTimeout(()=>{
      elemento('.pizzaWindowArea').style.opacity = 1;
    }, 200);
    
  });

  elemento('.pizza-area').append(pizzaItem);
});

//eventos do modal
function closeModal(){
  elemento('.pizzaWindowArea').style.opacity = 0;
  setTimeout(()=>{
    elemento('.pizzaWindowArea').style.display = 'none';
  }, 200);
}

elementosTotais('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
  item.addEventListener('click', closeModal);
});

elemento('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
  if(modalQt>1){
    modalQt--;
    elemento('.pizzaInfo--qt').innerHTML = modalQt;
  }
});
elemento('.pizzaInfo--qtmais').addEventListener('click', ()=>{
  modalQt++;
  elemento('.pizzaInfo--qt').innerHTML = modalQt;
});

elementosTotais('.pizzaInfo--size').forEach((size,sizeIndex)=>{
  size.addEventListener('click', (e)=>{
    elemento('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');  
  });
});

elemento('.pizzaInfo--addButton').addEventListener('click', ()=>{
  let size = parseInt(elemento('.pizzaInfo--size.selected').getAttribute('data-key'));
  let identifier = pizzaJson[modalKey].id+'@'+size;
  let key = cart.findIndex((item)=>{
    return item.identifier == identifier;
  })
  if(key > -1){
    cart[key].qt += modalQt;
  }else{
    cart.push({
      identifier,
      id:pizzaJson[modalKey].id,
      size,
      qt:modalQt
    });
  }
  updateCart();
  closeModal();
});

function updateCart(){
  if(cart.length>0){
    elemento('aside').classList.add('show');
    elemento('.cart').innerHTML = '';
    for(let i in cart){
      let pizzaItem = pizzaJson.find((item)=>{
        return item.id == cart[i].id;
      });
      let cartItem = elemento('.models .cart--item').cloneNode(true);
      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
      
        default:
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      elemento('.cart').append(cartItem);
    }
  }else{
    elemento('aside').classList.remove('show');
  }
}