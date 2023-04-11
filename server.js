const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const passport = require('./passport');
const db = require('./queries');

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
app.get('/api/users', db.getUsers);
app.post('/api/register', db.registerUser);

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
app.get('/api/products', db.getAllProducts);
app.get('/api/products/:id', db.getProductById);
app.post('/api/products', db.createProduct);
app.put('/api/products/:id', db.updateProduct);
app.delete('/api/products/:id', db.deleteProduct)


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
