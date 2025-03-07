"use strict";

// Class definition
var KTSigninGeneral = (function () {
  // Elements
  var form;
  var submitButton;
  var validator;

  // Handle form
  var handleForm = function (e) {
    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    validator = FormValidation.formValidation(form, {
      fields: {
        email: {
          validators: {
            notEmpty: {
              message: "Email address is required",
            },
            emailAddress: {
              message: "The value is not a valid email address",
            },
          },
        },
        password: {
          validators: {
            notEmpty: {
              message: "The password is required",
            },
          },
        },
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap: new FormValidation.plugins.Bootstrap5({
          rowSelector: ".fv-row",
        }),
      },
    });

    // Handle form submit
    submitButton.addEventListener("click", function (e) {
      // Prevent button default action
      e.preventDefault();

      // Validate form
      validator.validate().then(function (status) {
        if (status == "Valid") {
          // Show loading indication
          submitButton.setAttribute("data-kt-indicator", "on");

          // Disable button to avoid multiple clicks
          submitButton.disabled = true;

          const formData = new FormData(form);
          const jsonData = Object.fromEntries(formData);

          // Simulate ajax request using fetch
          (async function () {
            // Hide loading indication
            submitButton.removeAttribute("data-kt-indicator");

            // Enable button
            submitButton.disabled = false;

            // Perform the fetch request to login
            fetch("https://insights-server-q2wv.onrender.com/api/v1/auth/login", {
              method: "POST", // POST request
              headers: {
                "Content-Type": "application/json", // Set the content type as JSON
              },
              body: JSON.stringify(jsonData), // Send the form data as JSON
            })
              .then((response) => response.json()) // Assuming the server returns JSON
              .then((data) => {
                if (data.success) {
                  // Show success message
                  Swal.fire({
                    text: "You have successfully logged in!",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                      confirmButton: "btn btn-primary",
                    },
                  }).then(function (result) {
                    if (result.isConfirmed) {
                      form.querySelector('[name="email"]').value = "";
                      form.querySelector('[name="password"]').value = "";
                      // Redirect or perform any further action, e.g., redirecting to a dashboard

                      Cookies.set("auth", JSON.stringify(data?.data));

                      window.location.href = "/"; // Example redirect
                    }
                  });
                } else {
                  // Show error message if login failed
                  Swal.fire({
                    text:
                      data.message ||
                      "Sorry, something went wrong. Please try again.",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                      confirmButton: "btn btn-primary",
                    },
                  });
                }
              })
              .catch((error) => {
                // Handle fetch error
                console.error("Error during login:", error);
                Swal.fire({
                  text: "Sorry, there was a problem with the request. Please try again.",
                  icon: "error",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                });
              });
          })(); // Simulate delay
        } else {
          // Show error popup if form validation failed
          Swal.fire({
            text: "Sorry, looks like there are some errors detected, please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      });
    });
  };

  // Public functions
  return {
    // Initialization
    init: function () {
      form = document.querySelector("#kt_sign_in_form");
      submitButton = document.querySelector("#kt_sign_in_submit");

      handleForm();
    },
  };
})();

// On document ready
KTUtil.onDOMContentLoaded(function () {
  KTSigninGeneral.init();
});
