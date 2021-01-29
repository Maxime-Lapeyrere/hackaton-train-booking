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
            name: `${basket[i].trip.departure}/${basket[i].trip.arrival}`,
            images: ["https://images.unsplash.com/photo-1607166452427-7e4477079cb9?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym94fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
          },
          unit_amount: parseInt(basket[i].trip.price * 100),
        },
        quantity: parseInt(basket[i].quantity),
      });
  }
  return stripeCart;
}

/* STRIPE - Create checkout session */
router.post('/', async (req, res) => {
  // router.post('/create-checkout-session', async (req, res) => {
  var stripeBasket = create_CheckoutCart(req.session.trips);
  console.log(stripeBasket)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: stripeBasket,
    mode: 'payment',
    success_url: `https://murmuring-caverns-59722.herokuapp.com/checkout/success`,
    cancel_url: `https://murmuring-caverns-59722.herokuapp.com/checkout/cancel`,
  });
  res.json({ id: session.id });
});

router.get('/cancel', function (req, res, next) {
  res.redirect('/basket');
})

router.get('/success', function (req, res, next) {
  res.render('success', { basket: req.session.basket, routename:""});
})

module.exports = router;
