const t=document.getElementById("productList"),n=document.getElementById("cart"),e=document.getElementById("cartList"),i=document.getElementById("openBtn"),c=document.getElementById("closeBtn"),d=document.getElementById("infoItem"),a=document.getElementById("info");i.addEventListener("click",(function(){n.classList.remove("hidden")})),c.addEventListener("click",(function(){n.classList.add("hidden")})),d.addEventListener("click",(function(){a.classList.contains("hidden")?a.classList.remove("hidden"):a.classList.add("hidden")}));Math.ceil(461/24);async function o(t){const n=new URLSearchParams({limit:24,page:t}),e=await fetch(`https://voodoo-sandbox.myshopify.com/products.json?${n}`);if(!e.ok)throw new Error(e.status);return await e.json()}function s(n){const e=n.map((({id:t,title:n,images:e,variants:i})=>{const c=n.slice(0,25);return`\n        <li class="relative product" id="${t}">\n          <img\n            width="300px"\n            height="300px"\n            src="${0!=e.length?e[0].src:"https://cdn.shopify.com/s/files/1/0690/0075/7529/products/AAUvwnj0ICORVuxs41ODOvnhvedArLiSV20df7r8XBjEUQ_s900-c-k-c0x00ffffff-no-rj_d0d589c0-228a-46d7-9f63-8b7aa0416075.jpg?v=1670516962"}"\n            alt="${c}"\n          />\n          <span\n            class="absolute p-2 bg-black rounded font-spaceGrotesk font-normal text-lightSand text-xs start-5 top-5"\n            >USED</span\n          >\n          <div class="flex items-center justify-between my-3">\n            <div class="font-spaceGrotesk font-bold text-sm">\n              <h3>${c}</h3>\n            <div class="flex gap-1">\n              <p>${i[0].price}</p>\n                <span>KR</span></div>\n            </div>\n            <div class="font-spaceGrotesk text-sm">\n              <p class="font-medium">Condition</p>\n              <p class="font-normal">Slightly used</p>\n            </div>\n          </div>\n            <button id="addCartBtn"\n              class="addCartBtn w-full py-4 bg-black font-spaceGrotesk font-bold text-lightSand rounded"\n            >\n              ADD TO CART\n            </button>\n        </li>\n      `})).join("");t.innerHTML=e}document.addEventListener("click",(t=>{"pagination-btn"===t.target.getAttribute("action-type")&&o(t.target.value).then((t=>{s(t.products)})).catch((t=>console.log(t)))})),o(1).then((t=>s(t.products))).catch((t=>console.log(t)));const r=[],l=t=>{for(const n of r)n.id===t.id&&p(t)},p=t=>{const n=document.getElementById("price"),e=document.getElementById("amountOfProduct");n.textContent=t.amount*t.price,e.textContent=t.amount},m=()=>{const t=document.getElementById("totalPrice"),n=r.reduce(((t,n)=>t+=n.amount*n.price),0);t.innerHTML=n.toFixed(2)+" KR."};t.addEventListener("click",(t=>{if("button"==t.target.tagName.toLowerCase()){if(r.length<1)r.push({id:t.target.parentElement.id,title:t.target.parentElement.children[2].children[0].children[0].textContent,imageSrc:t.target.parentElement.children[0].currentSrc,amount:1,price:t.target.parentElement.children[2].children[0].children[1].children[0].textContent});else{const n=r.find((n=>n.id===t.target.parentElement.id));n?n.amount++:r.push({id:t.target.parentElement.id,title:t.target.parentElement.children[2].children[0].children[0].textContent,imageSrc:t.target.parentElement.children[0].currentSrc,amount:1,price:t.target.parentElement.children[2].children[0].children[1].children[0].textContent})}g(r),r.forEach((t=>{l(t)})),m()}})),n.addEventListener("click",(t=>{if("removeBtn"===t.target.id||"decreaseBtn"===t.target.id||"increaseBtn"===t.target.id){const n=t.target.closest(".cartItem");console.log(n),console.log(n.id);const e=n.id;if(e){const i=r.findIndex((t=>t.id===e));"decreaseBtn"===t.target.id&&(1===r[i].amount?(n.parentElement.removeChild(n),r.splice(i,1)):(r[i].amount--,l(r[i]))),"increaseBtn"===t.target.id&&(r[i].amount++,l(r[i])),"removeBtn"===t.target.id&&(n.parentElement.removeChild(n),r.splice(i,1))}m()}}));const g=t=>{const n=t.map((({id:t,title:n,imageSrc:e,price:i})=>`\n          <li class="cartItem flex justify-between" id="${t}">\n    <a class="flex gap-5">\n      <img\n        width="74px"\n        height="74px"\n        src="${e}"\n        alt="${n}"\n      />\n      <div\n        class="flex flex-col gap-3 font-spaceGrotesk font-bold text-sm text-lightSand"\n      >\n        <p>${n}</p>\n          <div class="flex gap-1">\n              <p id="price">${i}</p>\n              <span>KR</span>\n          </div>\n\n      <div class="flex gap-3">\n        <button id="decreaseBtn"> - </button>\n        <p id="amountOfProduct"> 1 </p>\n        <button id="increaseBtn"> + </button>\n          </div>\n      </div>\n          </div>\n    </a>\n        <svg id="removeBtn" class="cursor-pointer"\nxmlns="http://www.w3.org/2000/svg"\nwidth="20"\nheight="20"\nviewBox="0 0 20 20"\nfill="none"\n>\n<path\n  d="M5 2V0H15V2H20V4H18V19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H3C2.73478 20 2.48043 19.8946 2.29289 19.7071C2.10536 19.5196 2 19.2652 2 19V4H0V2H5ZM4 4V18H16V4H4ZM7 7H9V15H7V7ZM11 7H13V15H11V7Z"\n  fill="#FCF7E6"\n/>\n</svg>\n  </li>\n        `)).join("");e.innerHTML=n};
//# sourceMappingURL=index.f8963bf0.js.map
