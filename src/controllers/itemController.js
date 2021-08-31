import {Products} from '../models/models.js';
const myProducts = new Products();

const getItems = () =>{
    const items = myProducts.getItems();
    if(!Object.keys(items).length) return {error : 'no hay productos cargados'};
    return Object.values(items);
};

const getItem = (id) =>{
    const item = myProducts.getItem(id);
    if(!item) return {error : 'producto no encontrado'}

    return item;
} 

const addItem = (title, price, thumbnail) => {
    const item = myProducts.addItem(title, price, thumbnail);
    return item;
};

const putItem = (id, title, price, thumbnail) =>{
    const item = getItem(id)
    let data = {
        title: title || item.title,
        price: price || item.price,
        thumbnail: thumbnail || item.thumbnail,
        id: item.id
    }
    const newItem = myProducts.modifyItem(id, data);
    return newItem;
}

const deleteItem = (id) =>{
    const item = myProducts.deleteItem(id);
    return item;
}


export default {
    getItems,
    addItem,
    getItem,
    putItem,
    deleteItem
}