// Create an instance of the Stripe object with your publishable API key
var stripe = Stripe("pk_test_51I9pcBBaZ5FeUoOTrgLW3FYmKn7b9SzOOUhJAED282pPt7nsOYs69F9gjXvRjkFjl1z8YB1KXac4Y6n56DxNnKCu00qdWg9S6l");

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