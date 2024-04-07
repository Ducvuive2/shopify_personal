// Put your application javascript here
if( document.getElementById('sort_by') != null ) {
    document.querySelector('#sort_by').addEventListener('change', function(e) {
        var url = new URL(window.location.href);
        url.searchParams.set('sort_by', e.currentTarget.value);

        window.location = url.href;
    });
}

if( document.getElementById('AddressCountryNew') != null ) {
    document.getElementById('AddressCountryNew').addEventListener('change', function(e) {
        var provinces = this.options[this.selectedIndex].getAttribute('data-provinces');
        var provinceSelector = document.getElementById('AddressProvinceNew');
        var provinceArray = JSON.parse(provinces);

        //console.log(provinceArray);
        if(provinceArray.length < 1) {
            provinceSelector.setAttribute('disabled','disabled');
        } else {
            provinceSelector.removeAttribute('disabled');
        }

        provinceSelector.innerHTML = '';
        var options = '';
        for(var i = 0; i < provinceArray.length; i++) {
            options += '<option value="' + provinceArray[i][0] + '">' + provinceArray[i][0] + '</option>';
        }

        provinceSelector.innerHTML = options;
    });
}

if(document.getElementById("forgotPassword") != null) {
    const forgotPasswordLink = document.getElementById("forgotPassword");
    const haveAccountLink = document.getElementById("Login");
    const forgotPasswordForm = document.querySelector("#forgot_password_form");
    const loginForm = document.querySelector("#login-form");

    // Function to toggle visibility
    function toggleForms() {
        forgotPasswordForm.classList.toggle("d-none");
        loginForm.classList.toggle("d-none");
    }

    // Check and add event listener for "Forgot your password?"
    if (forgotPasswordLink !== null) {
        forgotPasswordLink.addEventListener("click", function(e) {
            e.preventDefault();
            toggleForms();
        });
    }

    // Check and add event listener for "Have account?"
    if (haveAccountLink !== null) {
        haveAccountLink.addEventListener("click", function(e) {
            e.preventDefault();
            toggleForms();
        });
    }
    
}

var localeItems = document.querySelectorAll("#localeItem");
if(localeItems.length > 0) {
    localeItems.forEach(item => {
        item.addEventListener("click", event => {
            document.getElementById("localeCode").value = item.getAttribute("lang");
            document.getElementById("localization_form_tag").submit();
        });
    });
}


var productInfoAnchors = document.querySelectorAll("#productInfoAnchor");

var productModal;

if( document.getElementById('productInfoModal') != null ) {
    productModal = new bootstrap.Modal(document.getElementById('productInfoModal'), {});
}

if(productInfoAnchors.length > 0) {
    productInfoAnchors.forEach(item => {
        item.addEventListener("click", event => {

            var url = '/products/' + item.getAttribute('product-handle') + '.js';

            fetch(url)
            .then((resp) => resp.json())
            .then(function(data) {
                console.log(data);

                document.getElementById("productInfoImg").src = data.images[0];
                document.getElementById("productInfoTitle").innerHTML = data.title;
                document.getElementById("productInfoPrice").innerHTML = item.getAttribute('product-price');
                document.getElementById("productInfoDescription").innerHTML = data.description;

                // Add variants to select cart in Collection
                var variants = data.variants;
                var variantSelect = document.getElementById("modalItemID");
                variantSelect.innerHTML = '';
                variants.forEach(function( variant, index) {
                    console.log(variant);
                    variantSelect.options[variantSelect.options.length] = new Option(variant.title, variant.id);
                });

                productModal.show();
            });


        });
    });
}

var modalAddToCartForm = document.querySelector("#addToCartForm");
if( modalAddToCartForm != null ) {
    modalAddToCartForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let formData = {
            'items': [
                {
                    'id': document.getElementById("modalItemID").value,
                    'quantity': document.getElementById("modalItemQuantity").value
                }
            ]
        };

        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then((resp) => { 
            return resp.json();
        })
        .then((data) => {
            update_cart();
        })
        .catch((err) => {
            console.error('Error: ' + err);
        })
    });
}

document.addEventListener('DOMContentLoaded', function() {
    update_cart();
});

function update_cart() {
    fetch('/cart.js') 
    .then((resp) => resp.json())
    .then((data) => document.getElementById("numberOfCartItems").innerHTML = data.items.length)
    .catch((err) => console.error(err));
}


var predictiveSearchInput = document.getElementById('searchInputField');
var timer;

var offcanvasSearch = document.getElementById('offcanvasSearchResult');
var bsOffcanvas = new bootstrap.Offcanvas(offcanvasSearch);

if(predictiveSearchInput != null) {
    predictiveSearchInput.addEventListener('input', function(e) {

        clearTimeout(timer);

        if(predictiveSearchInput.value) {
            timer = setTimeout(fetchPredictiveSearch, 300);
        }


    });
}

function fetchPredictiveSearch() {
    fetch(`/search/suggest.json?q=${predictiveSearchInput.value}&resources[type]=product`)
    .then(resp => resp.json())
    .then(data => { 
        console.log(data);

        var products = data.resources.results.products;

        document.getElementById('search_results_body').innerHTML = '';

        products.forEach(function(product, index) {
            document.getElementById('search_results_body').innerHTML += `
                <div class="card" style="width: 19rem;">
                    <a href = "${product.url}" title = "${product.title}">
                        <img src="${product.image}" class="card-img-top w-100">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">$${product.price}</p>
                    </div>
                </div>
            `
        });
        bsOffcanvas.show();
    });
}