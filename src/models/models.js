import { nanoid } from 'nanoid';

class Products{
    constructor(){
        this.items = {};
    }

    addItem(title, price, thumbnail){
        let item = new Item(title, price, thumbnail, this.items.length);
        this.items[item.id] = item;
        return item;
    };

    getItems(){
        return this.items;
    };
    
    getItem(id){
        return this.items[id];
    };

    modifyItem(id, data){
        this.items[id] = {...data};
        return this.items[id]
    };
    
    deleteItem(id){
        const item = this.items[id];
        delete this.items[id]
        return item;
    }
}

class Item{
    constructor(title, price, thumbnail, id){
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
        this.id = nanoid(4);
    }
}

export {
    Products, 
}