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

const container = document.getElementById("features-container");

features.forEach((feature) => {
  container.innerHTML += `
      <div class="col-6 col-md-3 mb-4">
        <div class="d-flex flex-column align-items-center">
          <div class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style="width:60px; height:60px;">
            <i class="bi ${feature.icon}" style="font-size:1.5rem;"></i>
          </div>
          <h5 class="fw-semibold">${feature.title}</h5>
          <p class="text-muted small">${feature.description}</p>
        </div>
      </div>
    `;
});

$(document).ready(function () {
  $.ajax({
    url: "products.json", // <-- your JSON file
    method: "GET",
    dataType: "json",
    success: function (data) {
      let products = data.products;
      let html = "";

      $.each(products, function (index, product) {
        html += `
       <div class="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
          <div class="card border-0 shadow card-hover h-100">
            <img src="${product.img1}" class="product-image rounded-2 cursor-pointer" alt="${product.title}" data-id=${product.id}>
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">ID: ${product.id}</p>
                </div>
                <i class="bi bi-bookmark-plus fs-4"></i>
              </div>
            </div>
            <div class="row g-0 align-items-center text-center border-top">
              <div class="col-4">
                <h5>$${product.price}</h5>
              </div>
              <div class="col-8">
                <a href="#" class="btn btn-dark w-100 p-2 rounded-0 text-warning">ADD TO CART</a>
              </div>
            </div>
          </div>
        </div>
      `;
      });

      // Append all cards at once
      $("#product-list").html(html);
    },
    error: function () {
      $("#product-list").html(
        "<p class='text-danger'>Failed to load products.</p>"
      );
    },
  });
});

const products = [
  {
    id: 1,
    img1: "https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/8/1/9/xl-white-chex-shirt-mentific-original-imahc5ha7nyxxmvu.jpeg?q=70",
    title: "Checked White Shirt",
    description: "Classic white shirt with modern check pattern.",
    price: "29.99",
    oldPrice: "39.99",
    discount: "25%",
    category: "Shirts",
    rating: 4,
    totalCustomerReviews: 85,
    customerFeedback: [
      { user: "Alice", comment: "Excellent quality!" },
      { user: "Bob", comment: "Fits perfectly." },
      { user: "Charlie", comment: "Worth the price." },
    ],
  },
  {
    id: 2,
    img1: "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/n/0/m/l-polo-8015-kajaru-original-imaherkhrkpnzzjw.jpeg?q=70",
    title: "Black Cotton T-Shirt",
    description: "Comfortable everyday black t-shirt in pure cotton.",
    price: "15.99",
    oldPrice: "20.99",
    discount: "24%",
    category: "T-Shirts",
    rating: 5,
    totalCustomerReviews: 120,
    customerFeedback: [
      { user: "Alice", comment: "Great quality and fit!" },
      { user: "Bob", comment: "Very comfortable for daily wear." },
    ],
  },
];

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

// Details
$(document).on("click", ".product-image", function () {
  const idProduct = parseInt($(this).data("id"));
  const product = products.find((p) => p.id === idProduct);

  if (product) {
    $("#productImage").attr("src", product.img1);
    $("#productTitle").text(product.title);
    $("#productCategory").text(product.category || "Category");
    $("#productDescription").text(product.description);
    $("#productPrice").text("$" + product.price);
    $("#productOldPrice").text(product.oldPrice ? "$" + product.oldPrice : "");
    $("#productDiscount").text(product.discount ? product.discount : "");
    $("#productRating").html(renderStars(product.rating || 4));
    $("#productRatingValue").text(
      "(" + (product.totalCustomerReviews || 0) + " reviews)"
    );
    renderFeedback(product.customerFeedback || []);

    const productInCart = (
      JSON.parse(localStorage.getItem("cartItems")) || []
    ).some((item) => item.id === product.id);
    console.log(productInCart);

    if (productInCart) {
      $("#addToCartBtnContainer").addClass("d-none"); // hide flex container properly
    } else {
      $("#addToCartBtnContainer").removeClass("d-none"); // show again
    }

    new bootstrap.Modal(document.getElementById("productModal")).show();
  }
});

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
