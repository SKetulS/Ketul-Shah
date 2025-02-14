document.addEventListener("DOMContentLoaded", function () {
    let selectedVariantId = null;
    let selectedColor = "";
    let selectedSize = "";

    // Open Product Popup
    window.openProductPopup = function (productId) {
        fetch(`/products/${productId}.js`)
            .then(response => response.json())
            .then(productData => {
                document.getElementById("popup-image").src = productData.images[0];
                document.getElementById("popup-title").innerText = productData.title;
                document.getElementById("popup-price").innerText = `$${(productData.price / 100).toFixed(2)}`;
                document.getElementById("popup-description").innerText = productData.description;

                let colors = new Set();
                let sizes = new Set();
                let colorContainer = document.getElementById("popup-colors");
                let sizeSelect = document.getElementById("popup-size");

                colorContainer.innerHTML = "";
                sizeSelect.innerHTML = "<option>Select Size</option>";

                productData.variants.forEach(variant => {
                    if (variant.option1) colors.add(variant.option1);
                    if (variant.option2) sizes.add(variant.option2);
                });

                colors.forEach(color => {
                    let colorOption = document.createElement("button");
                    colorOption.classList.add("color-option");
                    colorOption.innerText = color;
                    colorOption.onclick = function () {
                        selectedColor = color;
                        updateSelectedVariant(productData);
                    };
                    colorContainer.appendChild(colorOption);
                });

                sizes.forEach(size => {
                    let sizeOption = document.createElement("option");
                    sizeOption.value = size;
                    sizeOption.innerText = size;
                    sizeOption.addEventListener("change", function () {
                        selectedSize = this.value;
                        updateSelectedVariant(productData);
                    });
                    sizeSelect.appendChild(sizeOption);
                });

                document.getElementById("product-popup").style.display = "block";
            });
    };

    // Close Product Popup
    window.closeProductPopup = function () {
        document.getElementById("product-popup").style.display = "none";
    };

    // Update Selected Variant
    function updateSelectedVariant(productData) {
        productData.variants.forEach(variant => {
            if (variant.option1 === selectedColor && variant.option2 === selectedSize) {
                selectedVariantId = variant.id;
            }
        });
    }

    // Add to Cart Button Click
    document.getElementById("add-to-cart-btn").addEventListener("click", function () {
        if (!selectedVariantId) {
            alert("Please select a variant before adding to cart.");
            return;
        }

        fetch('/cart/add.js', {
            method: 'POST',
            body: JSON.stringify({ id: selectedVariantId, quantity: 1 }),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => response.json())
            .then(() => {
                if (selectedColor === "Black" && selectedSize === "Medium") {
                    const softWinterJacketId = "12345678901234"; // Replace with actual Variant ID
                    fetch('/cart/add.js', {
                        method: 'POST',
                        body: JSON.stringify({ id: softWinterJacketId, quantity: 1 }),
                        headers: { 'Content-Type': 'application/json' }
                    }).then(() => {
                        alert("Product added to cart! 'Soft Winter Jacket' has been automatically added.");
                    });
                } else {
                    alert("Product added to cart!");
                }
            });

        closeProductPopup();
    });
});
