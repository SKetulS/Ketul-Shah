document.addEventListener("DOMContentLoaded", function () {
    const bannerImages = document.querySelectorAll(".banner-image");
    let currentImage = 0;
  
    setInterval(() => {
      bannerImages[currentImage].classList.remove("active");
      currentImage = (currentImage + 1) % bannerImages.length;
      bannerImages[currentImage].classList.add("active");
    }, 5000);
  
    document.querySelectorAll(".view-product").forEach(button => {
      button.addEventListener("click", function () {
        const productId = this.parentElement.dataset.productId;
        const popup = document.getElementById("product-popup");
        popup.style.display = "block";
  
        fetch(`/products/${productId}.js`)
          .then(res => res.json())
          .then(data => {
            document.querySelector(".popup-details").innerHTML = `
              <h3>${data.title}</h3>
              <p>${data.price / 100} USD</p>
              <button id="confirm-add-to-cart">ADD TO CART</button>
            `;
          });
  
        document.getElementById("confirm-add-to-cart").addEventListener("click", function () {
          fetch("/cart/add.js", {
            method: "POST",
            body: JSON.stringify({ quantity: 1, id: productId }),
            headers: { "Content-Type": "application/json" }
          }).then(() => {
            alert("Added to Cart!");
          });
        });
      });
    });
  
    document.querySelector(".close").addEventListener("click", () => {
      document.getElementById("product-popup").style.display = "none";
    });
  });
  