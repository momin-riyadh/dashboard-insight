"use strict";

// Class definition
var KTSignupGeneral = (function () {
  // Elements
  var form;
  var submitButton;
  var validator;
  var passwordMeter;

  // Handle form
  var handleForm = function (e) {
    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    validator = FormValidation.formValidation(form, {
      fields: {
        "first-name": {
          validators: {
            notEmpty: {
              message: "First Name is required",
            },
          },
        },
        "last-name": {
          validators: {
            notEmpty: {
              message: "Last Name is required",
            },
          },
        },
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
            callback: {
              message: "Please enter valid password",
              callback: function (input) {
                if (input.value.length > 0) {
                  return validatePassword();
                }
              },
            },
          },
        },
        "confirm-password": {
          validators: {
            notEmpty: {
              message: "The password confirmation is required",
            },
            identical: {
              compare: function () {
                return form.querySelector('[name="password"]').value;
              },
              message: "The password and its confirm are not the same",
            },
          },
        },
        toc: {
          validators: {
            notEmpty: {
              message: "You must accept the terms and conditions",
            },
          },
        },
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger({
          event: {
            password: false,
          },
        }),
        bootstrap: new FormValidation.plugins.Bootstrap5({
          rowSelector: ".fv-row",
          eleInvalidClass: "",
          eleValidClass: "",
        }),
      },
    });

    // Handle form submit
    submitButton.addEventListener("click", function (e) {
      e.preventDefault();

      validator.revalidateField("password");

      validator.validate().then(function (status) {
        if (status == "Valid") {
          // Show loading indication
          submitButton.setAttribute("data-kt-indicator", "on");

          // Disable button to avoid multiple clicks
          submitButton.disabled = true;

          // Form data store
          const formData = new FormData(form);
          const jsonData = Object.fromEntries(formData);
          const data = {
            name: jsonData["first-name"] + " " + jsonData["last-name"],
            email: jsonData.email,
            password: jsonData?.password,
            role: "admin",
            company: "KCL",
          };

          console.log(jsonData); // Debugging

          // Fetch API use communicate server
          (async function () {
            try {
              const response = await fetch(
                "https://insights-server-q2wv.onrender.com/api/v1/auth/register",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                }
              );

              const result = await response.json();

              // Hide loading indication
              submitButton.removeAttribute("data-kt-indicator");
              submitButton.disabled = false;

              if (response.ok) {
                // Success message
                Swal.fire({
                  text: "You have successfully signed up!",
                  icon: "success",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                }).then(function (result) {
                  if (result.isConfirmed) {
                    form.reset(); // reset form
                    passwordMeter.reset(); // reset password meter
                    location.replace(`/authentication/flows/basic/sign-in.html`)
                  }
                });
              } else {
                throw new Error(result.message || "Something went wrong!");
              }
            } catch (error) {
              console.error("Error:", error);

              // Hide loading indication
              submitButton.removeAttribute("data-kt-indicator");
              submitButton.disabled = false;

              // Error message popup
              Swal.fire({
                text:
                  error.message ||
                  "Sorry, something went wrong. Please try again.",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              });
            }
          })();
        } else {
          // Validation error popup
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

    // Handle password input
    form
      .querySelector('input[name="password"]')
      .addEventListener("input", function () {
        if (this.value.length > 0) {
          validator.updateFieldStatus("password", "NotValidated");
        }
      });
  };

  // Password input validation
  var validatePassword = function () {
    return passwordMeter.getScore() === 100;
  };

  // Public functions
  return {
    // Initialization
    init: function () {
      // Elements
      form = document.querySelector("#kt_sign_up_form");
      submitButton = document.querySelector("#kt_sign_up_submit");
      passwordMeter = KTPasswordMeter.getInstance(
        form.querySelector('[data-kt-password-meter="true"]')
      );

      handleForm();
    },
  };
})();

// On document ready
KTUtil.onDOMContentLoaded(function () {
  KTSignupGeneral.init();
});
