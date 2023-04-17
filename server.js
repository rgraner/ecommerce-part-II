const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const passport = require('./passport');
const dbProducts = require('./db/products');
const dbUsers = require('./db/users');
const dbCart = require('./db/cart');
const dbOrders = require('./db/orders');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' })
})

// users endpoints
// orders endpoints
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of all users
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
app.get('/api/users', dbUsers.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
app.get('/api/users/:id', dbUsers.getUserById);
app.post('/api/create-user', dbUsers.createUser);
app.put('/api/users/:id', dbUsers.updateUser);
app.delete('/api/users/:id', dbUsers.deleteUser);

app.post('/api/login', 
passport.authenticate('local', { failureRedirect: '/api/login-failure'}),
(req, res) => {
  res.json({ success:true, user: req.user });
});

app.get('/api/logout', (req, res) => {
  req.logout();
  res.json({ success:true });
});

app.get('/api/login-failure', (req, res) => {
  res.status(401).json({ success: false, message: 'incorrect email or password.'});
});

// products endpoints
// orders endpoints
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get a list of all products
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
app.get('/api/products', dbProducts.getAllProducts);
app.get('/api/products/:id', dbProducts.getProductById);
app.post('/api/products', dbProducts.createProduct);
app.put('/api/products/:id', dbProducts.updateProduct);
app.delete('/api/products/:id', dbProducts.deleteProduct);

// cart endpoints
app.get('/api/users/:userId/cart/', dbCart.getCartItems);
app.post('/api/users/:userId/cart/', dbCart.createCartItem);
app.put('/api/users/:userId/cart/:itemId', dbCart.updateCartItem);
app.delete('/api/users/:userId/cart/:itemId', dbCart.deleteCartItem);

// Checkout
app.post('/api/users/:userId/checkout', dbCart.checkout);

// orders endpoints
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get a list of orders
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
app.get('/api/orders', dbOrders.getAllOrders);
app.get('/api/orders/:orderId', dbOrders.getOrderById);
app.delete('/api/orders/:orderId', dbOrders.deleteOrder);

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})





