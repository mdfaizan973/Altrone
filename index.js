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
