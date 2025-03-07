(function () {
  // Wait for DOM to be fully loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Get all divs with class 'tableauPlaceholder'
    const tableauDivs = document.getElementsByClassName("tableauPlaceholder");

    // Loop through each div and add the footer
    Array.from(tableauDivs).forEach((tableauDiv) => {
      const footerDiv = document.createElement("div");
      footerDiv.className = "remove-footer";
      footerDiv.style.position = "absolute";
      footerDiv.style.width = "100%";
      footerDiv.style.height = "25px";
      footerDiv.style.background = "#fafafa";
      footerDiv.style.left = "10px";
      footerDiv.style.right = "10px";
      footerDiv.style.bottom = "0";

      tableauDiv.appendChild(footerDiv);
    });
  });
})();

console.log(isAuthenticated());
