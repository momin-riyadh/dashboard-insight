// router.js

function loadPage(page) {
  const pages = {
    login: "/login.html",
    dashboard: "/dashboard.html",
    profile: "/profile.html",
    settings: "/settings.html",
  };

  window.location.href = pages[page]; // Redirect to the specified page
}

// Handling Private Routes
function handlePrivateRoute(page) {
  if (!isAuthenticated()) {
    redirectToLogin();
  } else {
    loadPage(page);
  }
}

// Handling Public Routes (No Authentication needed)
function handlePublicRoute(page) {
  loadPage(page);
}
