// auth.js
function isAuthenticated() {
  const token = Cookies.get("auth");
  console.log(token);

  return token ? true : false; // If token exists, user is authenticated
}

function redirectToLogin() {
  window.location.href = "/login.html"; // Redirect to login page if not authenticated
}

function handleLogout() {
  Cookies.remove("auth");
  return redirectToLogin();
}

console.log(isAuthenticated());

console.log(Cookies.get("auth"));
