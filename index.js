const features = [
  {
    icon: "bi-truck",
    title: "Free Shipping",
    description: "On all orders over $50.",
  },
  {
    icon: "bi-shield-check",
    title: "Secure Payments",
    description: "100% secure transactions.",
  },
  {
    icon: "bi-box-seam",
    title: "Easy Returns",
    description: "30-day return policy.",
  },
  {
    icon: "bi-award",
    title: "Premium Quality",
    description: "Handpicked, high-quality items.",
  },
];
const userGuide = [
  {
    id: 1,
    title: "Clean & Responsive UI",
    description: "Layout adjusts for mobile, tablet, and desktop.",
  },
  {
    id: 2,
    title: "Interactive Dashboard",
    description: "Dashboard widgets highlight on hover.",
  },
  {
    id: 3,
    title: "Product Listing",
    description: "Products appear in a grid layout.",
  },
  {
    id: 4,
    title: "Search Products",
    description: "Smart search input to quickly find products.",
  },
  {
    id: 5,
    title: "Sort Products",
    description: "Sort by price, popularity, etc.",
  },
  {
    id: 6,
    title: "Filter by Category",
    description:
      "Select a category button to filter products dynamically by gender or type.",
  },
  {
    id: 7,
    title: "Product Details",
    description: "Click on product image to open details modal.",
  },
  {
    id: 8,
    title: "Add to Cart",
    description: "Add product to cart from card or modal.",
  },
  {
    id: 9,
    title: "Remove from Cart",
    description: "Remove items from the cart drawer.",
  },
  {
    id: 10,
    title: "Checkout",
    description: "Open modal with order summary on checkout.",
  },

  {
    id: 11,
    title: "Animations / Effects",
    description: "Subtle animations on UI elements for better UX.",
  },
];

$(document).ready(function () {
  const $container = $("#features-container");

  $.each(features, function (index, feature) {
    const featureHTML = `
      <div class="col-6 col-md-3 mb-4">
        <div class="d-flex flex-column align-items-center">
          <div class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style="width:60px; height:60px;">
            <i class="bi ${feature.icon}" style="font-size:1.5rem;"></i>
          </div>
          <h5 class="fw-semibold">${feature.title}</h5>
          <p class="text-muted small">${feature.description}</p>
        </div>
      </div>`;
    $container.append(featureHTML);
  });
});

// Global variables
let productsList = [];
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let currentProductModal = null;

// Render products
function renderProducts(products) {
  const $productList = $("#product-list");

  if (!products || products.length === 0) {
    $productList.html(`
      <div class="text-center text-muted w-100 py-5">
        <i class="bi bi-cart-x display-1 mb-3"></i>
        <p class="h5">No products found</p>
      </div>
    `);
    return;
  }

  $productList.css("opacity", 0);
  let html = "";

  $.each(products, function (index, product) {
    html += `
      <div class="col-6 col-sm-6 col-md-4 col-lg-3 mb-4 product-animate" style="transform: translateY(30px) scale(0.95); opacity:0; transition: all 0.4s ease ${
        index * 0.05
      }s;">
        <div class="card border-0 shadow card-hover h-100">
          <img src="${
            product.img1
          }" class="product-image rounded-2 cursor-pointer" alt="${
      product.title
    }" data-id=${product.id}>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text"><span class="text-warning">${renderStars(
                  product.rating || 1
                )}</span></p>
              </div>
              <i class="bi bi-bookmark-plus fs-4"></i>
            </div>
          </div>
          <div class="row g-0 align-items-center text-center border-top">
            <div class="col-4">
              <h5>$${product.price}</h5>
            </div>
            <div class="add-to-cart-btn col-8" data-id=${product.id}>
              <a href="#" class="btn btn-dark w-100 p-2 rounded-0 text-warning">ADD TO CART</a>
            </div>
          </div>
        </div>
      </div>`;
  });

  $productList.html(html);

  // Animate product cards
  $(".product-animate").each(function (i, el) {
    setTimeout(() => {
      $(el).css({ transform: "translateY(0) scale(1)", opacity: 1 });
    }, i * 50);
  });

  $productList.css("opacity", 1);
}

// Initial product load
$(document).ready(function () {
  renderCart();

  $.ajax({
    url: "products.json",
    method: "GET",
    dataType: "json",
    success: function (data) {
      productsList = data.products;
      renderProducts(productsList);
      updateCartCount();
    },
    error: function () {
      $("#product-list").html(
        "<p class='text-danger'>Failed to load products.</p>"
      );
    },
  });
});

// Search functionality
let debounceTimeout;
$(".search-input").on("input", function () {
  clearTimeout(debounceTimeout);
  const input = $(this);

  debounceTimeout = setTimeout(() => {
    const searchValue = input.val().toLowerCase();

    const filteredProducts = productsList.filter((product) => {
      return (
        (product.title && product.title.toLowerCase().includes(searchValue)) ||
        (product.gender &&
          product.gender.toLowerCase().includes(searchValue)) ||
        (product.category &&
          product.category.toLowerCase().includes(searchValue)) ||
        (product.name && product.name.toLowerCase().includes(searchValue))
      );
    });

    renderProducts(filteredProducts);
  }, 500);

  $(".category-btn").first().click();
});

// Sorting functionality
$("#sortProductByPrice").on("change", function () {
  $(".category-btn").first().click();

  const sortValue = $(this).val();
  let sortedProducts = [...productsList];

  if (sortValue === "low-high") {
    sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortValue === "high-low") {
    sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  renderProducts(sortedProducts);
});

// Category filter
$(document).ready(function () {
  $(".category-btn").click(function () {
    $(".category-btn").removeClass("category-active");
    $(this).addClass("category-active");

    const selectedCategory = $(this).text().trim().toLowerCase();
    const filteredProducts =
      selectedCategory === "all"
        ? productsList
        : productsList.filter(
            (product) =>
              product.gender &&
              product.gender.trim().toLowerCase() === selectedCategory
          );

    renderProducts(filteredProducts);
  });

  $(".category-btn").first().click();
});

// Utility functions
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  $(".cart-count").text(cartItems.length);
}

function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars +=
      i <= rating
        ? '<i class="bi bi-star-fill"></i>'
        : '<i class="bi bi-star"></i>';
  }
  return stars;
}

// Product details modal
$(document).on("click", ".product-image", function () {
  const idProduct = parseInt($(this).data("id"));
  const product = productsList.find((p) => p.id === idProduct);
  currentProductModal = product;

  if (!product) return;

  $("#productImage").attr("src", product.img1);
  $("#productTitle").text(product.title);
  $("#productCategory").text(product.category || "Category");
  $("#productDescription").text(product.description);
  $("#productPrice").text("$" + product.price);
  $("#productOldPrice").text(product.oldPrice ? "$" + product.oldPrice : "");
  $("#productDiscount").text(product.discount ? product.discount : "");
  $("#productRating").html(renderStars(product.rating || 1));
  $("#productRatingValue").text(
    "(" + (product.totalCustomerReviews || 0) + " reviews)"
  );
  renderFeedback(product.customerFeedback || []);

  const productInCart = (
    JSON.parse(localStorage.getItem("cartItems")) || []
  ).some((item) => item.id === product.id);

  if (productInCart) $("#addToCartBtnContainer").addClass("d-none");
  else $("#addToCartBtnContainer").removeClass("d-none");

  new bootstrap.Modal(document.getElementById("productModal")).show();
});

// Feedback rendering
function renderFeedback(reviews = []) {
  const $container = $("#customerFeedback");
  $container.empty();

  if (reviews.length === 0) {
    $container.append('<div class="text-muted small">No reviews yet.</div>');
  } else {
    reviews.forEach((r) => {
      const reviewHtml = `
        <div class="list-group-item p-2 border-0 d-flex align-items-start" style="background-color:#fff; border-bottom:1px solid #e9ecef;">
          <i class="bi bi-person-circle fs-5 me-2 text-primary"></i>
          <div>
            <span class="fw-semibold">${r.user}</span>
            <p class="mb-0 text-secondary small">${r.comment}</p>
          </div>
        </div>`;
      $container.append(reviewHtml);
    });
  }
}

// Cart rendering
function renderCart() {
  const $cartList = $("#cart-items-list");
  $cartList.empty();
  let total = 0;
  const items = JSON.parse(localStorage.getItem("cartItems")) || [];

  if (items.length === 0) {
    $cartList.append(`
      <div id="emptyCart" class="text-center text-muted py-4">
        <i class="bi bi-cart-x display-4"></i>
        <p class="mt-2">Your cart is empty</p>
      </div>
    `);
  } else {
    items.forEach((product) => {
      total += parseFloat(product.price);
      const card = $(`
        <div class="card shadow-sm border-0 rounded-3 mb-2">
          <div class="card-body d-flex align-items-center">
            <img src="${product.img1}" alt="${product.title}" class="product-image rounded me-3 border" data-id="${product.id}" style="width:60px; height:60px; object-fit:cover;">
            <div class="flex-grow-1">
              <h6 class="mb-1 fw-semibold">${product.title}</h6>
              <p class="text-muted small mb-0">$ ${product.price}</p>
            </div>
            <button class="btn btn-sm btn-outline-danger ms-3 remove-item" data-id="${product.id}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>`);
      $cartList.append(card);
    });
  }

  updateCartTotal();
  updateCartCount();
}

function updateCartTotal() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const total = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price || 0),
    0
  );
  $("#cart-total").text(total.toFixed(2));
}

// Add to cart
$(document).on("click", ".add-to-cart-btn", function (e) {
  e.preventDefault();

  const idProduct = $(this).data("id");
  const product = idProduct
    ? productsList.find((p) => p.id === parseInt(idProduct))
    : currentProductModal;
  if (!product) return;

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const isPresent = cartItems.some((item) => item.id === product.id);

  if (isPresent) {
    alert("Already in Cart!");
    return;
  }

  if (idProduct) {
    let $img = $(this).closest(".card").find("img.product-image");
    let $flyImg = $img.clone().addClass("product-fly");
    $("body").append($flyImg);

    let cartOffset = $(".cart-btn").offset();
    let imgOffset = $img.offset();

    $flyImg.css({
      top: imgOffset.top,
      left: imgOffset.left,
      width: $img.width(),
      height: $img.height(),
    });

    setTimeout(() => {
      $flyImg.css({
        top: cartOffset.top + 10,
        left: cartOffset.left + 10,
        width: 20,
        height: 20,
        opacity: 0.5,
      });
    }, 10);

    $flyImg.on("transitionend", function () {
      $flyImg.remove();
      cartItems.push(product);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      renderCart();
      updateCartCount();
      $("#addToCartBtnContainer").addClass("d-none");
    });
  } else {
    cartItems.push(product);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    renderCart();
    updateCartCount();
    $("#addToCartBtnContainer").addClass("d-none");
  }
});

// Remove from cart
$(document).on("click", ".remove-item", function () {
  const idToRemove = parseInt($(this).data("id"));
  const $card = $(this).closest(".card");

  $card.slideUp(300, function () {
    $card.remove();
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems = cartItems.filter((item) => item.id !== idToRemove);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();
    updateCartTotal();
  });
});

// Checkout
$(document).on("click", "#checkout", function () {
  const items = JSON.parse(localStorage.getItem("cartItems")) || [];
  if (items.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  $("#orderSuccessModal").modal("show");
});

// Continue shopping
$(document).on("click", "#continueShopping", function () {
  localStorage.removeItem("cartItems");
  $("#cart-items-list").empty();
  $(".cart-total").text("0");
  updateCartCount();
  window.location.reload();
});

// User Guide Section

$(document).ready(function () {
  userGuide.forEach((f) => {
    $("#featuresList").append(`
      <li class="list-group-item d-flex align-items-center">
        <span class="badge bg-info me-3">${f.id}</span>
        <div>
          <strong>${f.title}</strong><br/>
          ${f.description}
        </div>
      </li>`);
  });
});
