const categoryList = document.querySelector(".categories")
const productsArea = document.querySelector(".products")
const basketBtn = document.querySelector("#basket")
const closeBtn = document.querySelector("#close")
const modal = document.querySelector(".modal-wrapper")
const basketList = document.querySelector("#list")
const totalSpan = document.querySelector("#total-price")
const totalCount = document.querySelector("#count")


// ! API
// ! baseurl
const baseurl = "https://api.escuelajs.co/api/v1"

document.addEventListener('DOMContentLoaded',()=>{
    fetchCategories()
    fetchProduct()
})

function fetchCategories(){
    fetch(`${baseurl}/categories`)
    .then((response)=> response.json())
    .then((data)=>{
        renderCategories(data.slice(1,5))
    })
    .catch((error)=> console.log(error))
}

function renderCategories(categories){
    categories.forEach((category)=>{
        const categoryDiv = document.createElement('div')
        categoryDiv.classList.add('category-card')
        categoryDiv.innerHTML = `
            <img src=${category.image}/>
            <p>${category.name}</p>
        `
        categoryList.appendChild(categoryDiv)
    })
}

async function fetchProduct(){
    try {
        const response = await fetch(`${baseurl}/products`)
        const data = await response.json()
        renderProduct(data.slice(0,25))
    } catch (error) {
        console.log(error)
    }
}

function renderProduct(products){
    const productsHTML = products
    .map(
        (product) => `
            <div class="card">
                <img src=${product.images[1]}/>
                <h4>${product.title}</h4>
                <h4>${
                    product.category.name ? product.category.name : "Diger"
                }</h4>
                <div class="action">
                    <span>${product.price}</span>
                    <button onclick="addTooBasket({id:${product.id}, title: '${product.title
                    
                    }'
                    ,price:${product.price}, img:'${product.images[1]
                    }',amount:1})"> Sepete Ekle </button>
                </div>
            </div>
        `
    )
    .join(' ')

    productsArea.innerHTML += productsHTML
}

// ! Sepet kısmı
let basket = [];
let total = 0;

basketBtn.addEventListener('click',()=>{
    modal.classList.add('active')
    renderBasket()
})

closeBtn.addEventListener('click',()=>{
    modal.classList.remove('active')
})

// ! Sepet islemleri

function addTooBasket(product){
    const found = basket.find((i)=>i.id === product.id);
    
    if(found){
        found.amount++;
    } else{
        basket.push(product)
    }
}

function renderBasket(){
    const cardsHTML = basket
    .map(
        (product)=>`
        <div class="item">
            <img src=${product.img}/>
            <h3 class="title">${product.title}/>
            <h4 class="price">${product.price}/>
            <p>Miktar: ${product.amount} </p>
            <img onclick="deleteItem(${product.id})" id="delete" src="images/e-trash.png"/>
        </div>
        `
    )
    .join(' ')

    basketList.innerHTML = cardsHTML

    calculateTotal()
}

function calculateTotal(){
    // ! Dizi elemanlarıyla işlem yapabilmek için "reduce" metoodunu kullanırız.
    const sum = basket.reduce((sum,i)=> sum + i.price * i.amount,0)
    const amount = basket.reduce((sum,i)=> sum + i.amount,0)

    totalSpan.innerText = sum
    totalCount.innerText = amount + ' ' + 'Urun'
}

function deleteItem(deleteid){

    basket = basket.filter((i) => i.id !== deleteid)

    // ! Sepet listesini güncellemek için fonksiyonumuzu tekrar çağırıyoruz.

    renderBasket()
}



