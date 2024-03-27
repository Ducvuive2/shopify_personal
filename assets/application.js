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

var productModal = new bootstrap.Modal(document.getElementById('productInfoModal'), {});

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

                productModal.show();
            });


        });
    });
}