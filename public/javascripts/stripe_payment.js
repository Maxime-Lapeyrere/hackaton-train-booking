// Create an instance of the Stripe object with your publishable API key
var stripe = Stripe("pk_test_51IEwheEQeYsy0y5XXzBM7ing6zs2QC7hFwT4gar4hJ9lkVCh5I1QNL9ytHWwdvAxigxAwP06XuzUiAcOjsadJgfx00Y2mnim2i");

var checkoutButton = document.getElementById("checkout-button");

checkoutButton.addEventListener("click", function () {
  fetch("/checkout", {
    method: "POST",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
      // If redirectToCheckout fails due to a browser or network
      // error, you should display the localized error message to your
      // customer using error.message.
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
});

// TEST : 
// Payment succeeds
// 4242 4242 4242 4242

// Payment requires authentication
// 4000 0025 0000 3155

// Payment is declined
// 4000 0000 0000 9995