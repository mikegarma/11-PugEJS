const express = require('express');
const app = express();
const PORT = 8080;

const itemController = require('./src/controllers/itemController.js');
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/', router);

app.use('/static', express.static(__dirname + '/public'));

app.listen(PORT, ()=>{
    console.log("Server initiated. Listening: ", PORT);
});

app.set("view engine", "pug");
app.set("views", __dirname + "/views/");

router.get('/products', (req, res)=>{
    let items = itemController.getItems();
    res.json(items);
});

router.post('/products', (req, res)=>{
    let {title, price, thumbnail} = req.body;
    let item = itemController.addItem(title, price, thumbnail);
    res.json(item);
});

router.get('/products/:id', (req, res)=>{
    let {id} = req.params;
    if(id===undefined) res.json({error: 'Falta el parametro `id`'});
    const item =  itemController.getItem(id);
    res.json(item);
});

router.put('/products/:id', (req, res)=>{
    let {id} = req.params;
    if(id===undefined) res.json({error: 'Falta el parametro `id`'});
    let {title, price, thumbnail} = req.body;
    const item =  itemController.putItem(id, title, price, thumbnail);
    res.json(item);
});

router.delete('/products/:id', (req, res)=>{
    let {id} = req.params;
    if(id===undefined) res.json({error: 'Falta el parametro `id`'});
    const item =  itemController.deleteItem(id);
    res.json(item);
});

app.get("/", (req, res)=>{
    let products = itemController.getItems();
    let foundProducts = products.length>0;
    res.render('products', {
        products: products,
        foundProducts,
    }); 
});

app.get("/new-product", (req, res)=>{
    res.render('new-product');
})