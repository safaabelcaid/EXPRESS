const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Logging Middleware
function loggingMiddleware(req, res, next) {
    const currentDate = new Date();
    console.log(`[${currentDate.toISOString()}] ${req.method} ${req.url}`);
    next();
}

app.use(loggingMiddleware); 
app.use(express.json());

let products = [
    { id: 1, name: 'iPhone 12 Pro', price: 1099.99 },
    { id: 2, name: 'Samsung Galaxy S21', price: 999.99 },
    { id: 3, name: 'Sony PlayStation 5', price: 499.99 },
    { id: 4, name: 'MacBook Pro 16', price: 2399.99 },
    { id: 5, name: 'DJI Mavic Air 2', price: 799.99 },
];

app.get('/products', (req, res) => {
    res.send(products);
});

app.get('/products/search', (req, res) => {
    let min = req.query.minPrice;
    let max = req.query.maxPrice;
    const search = products.filter(product => product.price > min && product.price < max);
    if (search.length) {
        res.send(search);
    } else {
        res.status(404).send('No products found within the given price range.');
    }
});

app.get('/products/:id', (req, res) => {
    let id = Number(req.params.id);
    let product = products.find(product => product.id === id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send('Product not found.');
    }
});

app.post('/products', (req, res) => {
    const product = req.body;
    if (!product.name) {
        return res.status(400).send('Please provide full information of the product.');
    }
    product.id = products.length + 1;
    products.push(product);
    res.status(201).send(product);
});

app.put('/products/:id', (req, res) => {
    let id = Number(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).send('Product with the provided ID not found.');
    }
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    res.send(product);
});

app.delete('/products/:id', (req, res) => {
    let id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        res.send(products);
    } else {
        res.status(404).send('Product not found.');
    }
});

app.get('/error-test', (req, res, next) => {
    throw new Error('Intentional error!');
});

function errorHandlerMiddleware(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('An error occurred! Please try again.');
}

app.use(errorHandlerMiddleware);

app.listen(port, () => {
    console.log('Server running on port ' + port);
});