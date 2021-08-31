import itemController from './controllers/itemController.js';
import express from 'express';
import http from 'http';
import path from 'path';

import {Server, Socket} from 'socket.io';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

const router = express.Router();
const viewsPath = path.resolve(__dirname, './views/');
const publicPath = path.resolve(__dirname, '../public/');

let chatMessages = [];
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/', router);
app.use('/public/', express.static(publicPath));

app.set("view engine", "pug");
app.set('views', viewsPath);

const myServer = http.Server(app);
const myWSServer = new Server(myServer);

myServer.listen(PORT, () => console.log("Http Server initiated. Listening: ", PORT));

/*
app.listen(PORT, ()=>{
    console.log("Server initiated. Listening: ", PORT);
});
*/

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
    myWSServer.emit("updateData");
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

myWSServer.on('connection', function (socket) {
    console.log('Un cliente se ha conectado');
  
    socket.on('askProducts', function (data) {
        try{
            let items = itemController.getItems();
            if(items.length) socket.emit('productsExchange', items);
        }
        catch(e){
            console.log(e); 
        }
    });

    socket.on('postData', function(data){
        let {title, price, thumbnail} = data;
        itemController.addItem(title, price, thumbnail);
        let items = itemController.getItems();
        myWSServer.emit('productsExchange', items);
    })

    socket.on('sendChatMessage', function(data){
        chatMessages.push(data);
        myWSServer.emit('sendLastMessage', data);
    })
    
    socket.on('joinedRoom', function(data){
        myWSServer.emit('loadMessages', chatMessages);
    })

});

