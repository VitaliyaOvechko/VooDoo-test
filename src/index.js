const productList = document.getElementById('productList');
const cart = document.getElementById('cart');
const cartList = document.getElementById('cartList');
const openCartBtn = document.getElementById('openBtn');
const closeCartBtn = document.getElementById('closeBtn');
const infoItem = document.getElementById('infoItem');
const information = document.getElementById('info');

//відкриття та закриття корзини товарів
openCartBtn.addEventListener('click', openCartProduct);
closeCartBtn.addEventListener('click', closeCartProduct);

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
let productsPerPage = 24;
const totalNumberOfProducts = 461;
const totalPages = Math.ceil(totalNumberOfProducts / productsPerPage);

document.addEventListener('click', e => {
  if (e.target.getAttribute('action-type') === 'pagination-btn') {
    fetchProducts(e.target.value)
      .then(products => {
        renderProductsList(products.products);
      })
      .catch(error => console.log(error));
  }
});

// Запит за продуктами
fetchProducts(1)
  .then(products => renderProductsList(products.products))
  .catch(error => console.log(error));

async function fetchProducts(page) {
  const params = new URLSearchParams({
    limit: productsPerPage,
    page: page,
  });
  const response = await fetch(
    `https://voodoo-sandbox.myshopify.com/products.json?${params}`
  );
  if (!response.ok) {
    throw new Error(response.status);
  }
  return await response.json();
}
// fetchProducts();

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
    // console.log(event);
    if (event.target.tagName.toLowerCase() == 'button') {
      if (cartArray.length < 1) {
        cartArray.push({
          id: event.target.parentElement.id,
          title:
            event.target.parentElement.children[2].children[0].children[0]
              .textContent,
          imageSrc: event.target.parentElement.children[0].currentSrc,
          amount: 1,
          price:
            event.target.parentElement.children[2].children[0].children[1]
              .children[0].textContent,
        });
      } else {
        const existedProduct = cartArray.find(
          el => el.id === event.target.parentElement.id
        );
        if (existedProduct) {
          existedProduct.amount++;
        } else {
          cartArray.push({
            id: event.target.parentElement.id,
            title:
              event.target.parentElement.children[2].children[0].children[0]
                .textContent,
            imageSrc: event.target.parentElement.children[0].currentSrc,
            amount: 1,
            price:
              event.target.parentElement.children[2].children[0].children[1]
                .children[0].textContent,
            // price: parseFloat(
            //   event.target.parentElement.parentElement.children[2].children[0]
            //     .children[1].children[0].textContent
            // ),
          });
        }
      }
      //   console.log(cartArray);
      renderCartList(cartArray);

      cartArray.forEach(product => {
        updateCart(product);
      });

      updateTotalPrice();
    }
  });
};

const updateCart = product => {
  for (const item of cartArray) {
    if (item.id === product.id) {
      updateProduct(product);
    }
  }
};

export const updateProduct = product => {
  const priceCartProduct = document.getElementById('price');
  const amountOfProduct = document.getElementById('amountOfProduct');

  priceCartProduct.textContent = product.amount * product.price;
  amountOfProduct.textContent = product.amount;
};

const updateTotalPrice = () => {
  const totalPriceElement = document.getElementById('totalPrice');

  const totalPrice = cartArray.reduce((result, cartItem) => {
    result += cartItem.amount * cartItem.price;
    return result;
  }, 0);
  totalPriceElement.innerHTML = totalPrice.toFixed(2) + ' KR.';
};

addToCart();

function cartProductistener() {
  cart.addEventListener('click', event => {
    // console.log(event);
    if (
      event.target.id === 'removeBtn' ||
      event.target.id === 'decreaseBtn' ||
      event.target.id === 'increaseBtn'
    ) {
      const productCartElement = event.target.closest('.cartItem');
      console.log(productCartElement);
      console.log(productCartElement.id);

      const productCartId = productCartElement.id;
      if (productCartId) {
        const productElementIndex = cartArray.findIndex(
          el => el.id === productCartId
        );
        if (event.target.id === 'decreaseBtn') {
          if (cartArray[productElementIndex].amount === 1) {
            productCartElement.parentElement.removeChild(productCartElement);
            cartArray.splice(productElementIndex, 1);
          } else {
            cartArray[productElementIndex].amount--;
            updateCart(cartArray[productElementIndex]);
          }
        }
        if (event.target.id === 'increaseBtn') {
          cartArray[productElementIndex].amount++;
          updateCart(cartArray[productElementIndex]);
        }
        if (event.target.id === 'removeBtn') {
          productCartElement.parentElement.removeChild(productCartElement);
          cartArray.splice(productElementIndex, 1);
        }
      }
      updateTotalPrice();
    }
  });
}

cartProductistener();

//рендер списку товарів в коризині
const renderCartList = products => {
  const markup = products
    .map(({ id, title, imageSrc, price }) => {
      return `
          <li class="cartItem flex justify-between" id="${id}">
    <a class="flex gap-5">
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
        <p id="amountOfProduct"> 1 </p>
        <button id="increaseBtn"> + </button>
          </div>
      </div>
          </div>
    </a>
        <svg id="removeBtn" class="cursor-pointer"
xmlns="http://www.w3.org/2000/svg"
width="20"
height="20"
viewBox="0 0 20 20"
fill="none"
>
<path
  d="M5 2V0H15V2H20V4H18V19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H3C2.73478 20 2.48043 19.8946 2.29289 19.7071C2.10536 19.5196 2 19.2652 2 19V4H0V2H5ZM4 4V18H16V4H4ZM7 7H9V15H7V7ZM11 7H13V15H11V7Z"
  fill="#FCF7E6"
/>
</svg>
  </li>
        `;
    })
    .join('');
  cartList.innerHTML = markup;
};
