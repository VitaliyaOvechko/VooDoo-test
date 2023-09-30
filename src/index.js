const productList = document.getElementById('productList');
const items = document.querySelectorAll('#pagination li');
const cart = document.getElementById('cart');
const cartList = document.getElementById('cartList');
const openCartBtn = document.getElementById('openBtn');
const closeCartBtn = document.getElementById('closeBtn');
const infoItem = document.getElementById('infoItem');
const information = document.getElementById('info');
const cartTotalPrice = document.getElementById('totalPrice');

//відкриття та закриття корзини товарів
openCartBtn.addEventListener('click', openCartProduct);
closeBtn.addEventListener('click', closeCartProduct);
function openCartProduct() {
  cart.classList.remove('hidden');
}

function closeCartProduct() {
  cart.classList.add('hidden');
}

//відкриття та закриття елементу з додатковою інформацією
infoItem.addEventListener('click', toggleInfo);
function toggleInfo() {
  if (information.classList.contains('hidden')) {
    showInfo();
  } else {
    hideInfo();
  }
}

function showInfo() {
  information.classList.remove('hidden');
}

function hideInfo() {
  information.classList.add('hidden');
}

//пагінація
let page = 1;
let productsPerPage = 24;
const totalNumberOfProducts = 461;
const totalPages = Math.ceil(totalNumberOfProducts / productsPerPage);

// for (let item of items) {
//   item.addEventListener('click', function () {
//     console.log(this);
//     this.classList.add('bg-black');

//     let pageNumber = this.innerHTML;
//     console.log(pageNumber);

//     fetchProducts()
//       .then(products => {
//         renderProductsList(products.products);
//         page = pageNumber;

//         // Replace button text after first request
//         // if (page > 1) {
//         //   fetchPostsBtn.textContent = 'Fetch more posts';
//         // }
//       })
//       .catch(error => console.log(error));
//   });
// }

// paginatedBtn.addEventListener('click', () => {
//   // Check the end of the collection to display an alert
//   if (page > totalPages) {
//     return toggleAlertPopup();
//   }

//   fetchProducts()
//     .then(products => {
//       renderProductsList(products.products);
//       page += 1;

//       // Replace button text after first request
//       if (page > 1) {
//         fetchPostsBtn.textContent = 'Fetch more posts';
//       }
//     })
//     .catch(error => console.log(error));
// });

fetchProducts()
  .then(products => renderProductsList(products.products))
  .catch(error => console.log(error));

function fetchProducts() {
  const params = new URLSearchParams({
    limit: productsPerPage,
    page: page,
  });
  return fetch(
    `https://voodoo-sandbox.myshopify.com/products.json?${params}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
fetchProducts();

//рендер списку товарів
function renderProductsList(products) {
  const markup = products
    .map(({ id, title, images, variants }) => {
      const cutTitle = title.slice(0, 25);
      const defaultSrc =
        'https://cdn.shopify.com/s/files/1/0690/0075/7529/products/AAUvwnj0ICORVuxs41ODOvnhvedArLiSV20df7r8XBjEUQ_s900-c-k-c0x00ffffff-no-rj_d0d589c0-228a-46d7-9f63-8b7aa0416075.jpg?v=1670516962';
      const imgSrc = images.length != 0 ? images[0].src : defaultSrc;
      return `
        <li class="relative product" id="${id}">
          <img
            width="300px"
            height="300px"
            src="${imgSrc}"
            alt="${cutTitle}"
          />
          <span
            class="absolute p-2 bg-black rounded font-spaceGrotesk font-normal text-lightSand text-xs start-5 top-5"
            >USED</span
          >
          <div class="flex items-center justify-between my-3">
            <div class="font-spaceGrotesk font-bold text-sm">
              <h3>${cutTitle}</h3>
            <div class="flex gap-1">
              <p>${variants[0].price}</p>
                <span>KR</span></div>
            </div>
            <div class="font-spaceGrotesk text-sm">
              <p class="font-medium">Condition</p>
              <p class="font-normal">Slightly used</p>
            </div>
          </div>
            <button id="addCartBtn"
              class="addCartBtn w-full py-4 bg-black font-spaceGrotesk font-bold text-lightSand rounded"
            >
              ADD TO CART
            </button>
        </li>
      `;
    })
    .join('');
  productList.innerHTML = markup;
}

//додавання товарів в корзину та видалення товарів з корзини
const cartArray = [];

export const addToCart = () => {
  productList.addEventListener('click', event => {
    console.log(event);
    if (event.target.tagName.toLowerCase() == 'button') {
      if (cartArray.length < 1) {
        cartArray.push({
          id: event.target.parentElement.parentElement.id,
          title:
            event.target.parentElement.parentElement.children[2].children[0]
              .children[0].textContent,
          amount: 1,
          price:
            event.target.parentElement.parentElement.children[2].children[0]
              .children[1].children[0].textContent,
        });
      } else {
        const existedProduct = cartArray.find(
          el => el.id === event.target.parentElement.parentElement.id
        );
        if (existedProduct) {
          existedProduct.amount++;
        } else {
          cartArray.push({
            id: event.target.parentElement.parentElement.id,
            title:
              event.target.parentElement.parentElement.children[2].children[0]
                .children[0].textContent,
            amount: 1,
            // price: parseFloat(
            //   event.target.parentElement.parentElement.children[2].children[0]
            //     .children[1].children[0].textContent
            // ),
            price:
              event.target.parentElement.parentElement.children[2].children[0]
                .children[1].children[0].textContent,
          });
        }
      }
      console.log(cartArray);
      renderCartList(cartArray);

      cartArray.forEach(product => {
        generateCart(product);
      });

      //   updateTotal();
    }
  });
};

const generateCart = product => {
  const productCartItem = cartList.children[0];
  if (product.id === productCartItem.id) {
    console.log('the same id');
    updateProduct(productCartItem, product);
  }
  //   else {
  //     cartProducts.appendChild(showInCart(product));
  //   }
};

export const updateProduct = (element, product) => {
  const priceCartProduct = document.getElementById('price');
  const numberOfProduct = document.getElementById('numberOfProduct');

  console.log(priceCartProduct);
  console.log(numberOfProduct);

  priceCartProduct.textContent = product.amount * product.price;
  numberOfProduct.textContent = product.amount;
};

addToCart();

//рендер списку товарів в коризині
const renderCartList = products => {
  const markup = products
    .map(({ id, title, imageSrc, price }) => {
      return `
          <li class="flex justify-between" id="${id}">
    <a class="flex">
      <img
        width="74px"
        height="74px"
        src="${imageSrc}"
        alt="${title}"
      />
      <div
        class="flex flex-col gap-3 font-spaceGrotesk font-bold text-sm text-lightSand"
      >
        <p>${title}</p>
          <div class="flex gap-1">
              <p id="price">${price}</p>
              <span>KR</span>
          </div>

      <div class="flex gap-3">
        <button id="decreaseBtn"> - </button>
        <p id="numberOfProduct"> 1 </p>
        <button id="increaseBtn"> + </button>
          </div>
      </div>
          </div>
    </a>
    <button id="removeBtn" class="py-1 bg-lightSand font-spaceGrotesk font-bold text-black rounded"> Rem
    </button>
  </li>
        `;
    })
    .join('');
  cartList.innerHTML = markup;
};

function removeCartProduct(e) {
  //   console.log(e.target);
  //   if (e.target.id === 'removeBtn') {
  //     const currentLi = e.target.parentElement;
  //     const currentId = currentLi.id;
  //     const savedData = JSON.parse(localStorage.getItem('cart')) || [];
  //     const newSavedData = savedData.filter(item => item.id !== currentId);
  //     localStorage.setItem('cart', JSON.stringify(newSavedData));
  //   }
  //   const numberOfProduct = e.target.parentElement.children[1];
  //   const currentNumber = +numberOfProduct.innerText;
  //   let newNumberOfProduct;
  //   const priseElement =
  //     e.target.parentElement.parentElement.children[1].children[0];
  //   const priceOfProduct = +priseElement.innerText;
  //   let newPriceOfProduct;
  //   console.log(priceOfProduct);
  //   if (e.target.id === 'increaseBtn') {
  //     newNumberOfProduct = currentNumber + 1;
  //     newPriceOfProduct = priceOfProduct * newNumberOfProduct;
  //     console.log(newNumberOfProduct);
  //     console.log(newPriceOfProduct);
  //   }
  //   if (e.target.id === 'decreaseBtn') {
  //     newNumberOfProduct = currentNumber === 1 ? 1 : currentNumber - 1;
  //   }
  //   numberOfProduct.textContent = newNumberOfProduct;
  //   //   priseElement.textContent = newPriceOfProduct;
}

//збільшення та зменшення кількості товару в корзині

// const decreaseBtn = document.getElementById('decreaseBtn');
// const increaseBtn = document.getElementById('increaseBtn');
// const numberOfProduct = document.getElementById('numberOfProduct');
// const totalPrice = document.getElementById('totalPrice');
// // console.log(numberOfProduct.innerText);
// // console.log(totalPrice.innerText);

// increaseBtn.addEventListener('click', function () {
//   //   numberOfProduct.innerText = (numberOfProduct.innerText | 0) + 1;
// });
