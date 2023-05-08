const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./loaders/swagger');

const passport = require('./loaders/passport');

const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const cartRoute = require('./routes/cart');

app.set('maxHttpHeaderSize', 65536); // set max header size to 64KB

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' })
});

app.use('/api/users', usersRoute);
app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/users/:userId/cart', cartRoute);

// Checkout
app.post('/api/users/:userId/checkout', cartRoute.checkout);

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});





