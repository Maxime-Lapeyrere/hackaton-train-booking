var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_51IEwheEQeYsy0y5XefwNojYA6SKvzJVO6W8SisSzXo01G3mAAfakv8OdQm8C4QZOg7pjZDFs0keXtBZIaxo7gekG00bbcBrPeN');


function create_CheckoutCart(basket) {
  var stripeCart = [];
  // var total = 0;

  for (var i = 0; i < basket.length; i++) {
    // total += basket[i].price * basket[i].quantity;
    stripeCart.push(
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${basket[i].departure}/${basket[i].arrival}`,
            images: "/images/trainlogo.png",
          },
          unit_amount: basket[i].price * 100,
        },
        quantity: basket[i].quantity,
      });
  }
  return stripeCart;
}

/* STRIPE - Create checkout session */
router.post('/', async (req, res) => {
  // router.post('/create-checkout-session', async (req, res) => {
  var stripeBasket = create_CheckoutCart(req.session.basket);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: stripeBasket,
    mode: 'payment',
    success_url: `http://localhost:3000/success`,
    cancel_url: `http://localhost:3000/cancel`,
  });
  res.json({ id: session.id });
});

router.get('/cancel', function (req, res, next) {
  res.render('shop', { basket: req.session.basket });
})

router.get('/success', function (req, res, next) {
  res.render('success', { basket: req.session.basket });
})

module.exports = router;
