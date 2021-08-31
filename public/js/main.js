const socket = io.connect('http://localhost:8080', { forceNew: true });
const form = document.getElementById('product-form');

socket.emit('askProducts');

socket.on('productsExchange', function (data) {
  render(data);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let data = {
    'title': e.target[0].value,
    'price': e.target[1].value,
    'thumbnail': e.target[2].value,
  }
  
  socket.emit('postData', data)
});

const render = (data) => {
  cleanRows();
  console.log(data);
  data.forEach(item => {
    createRow(item);
  })
}

const cleanRows = () => {
  let tbody = document.getElementById('tbody');
  console.log(tbody)
  let newTbody = document.createElement('tbody');
  newTbody.id = "tbody";
  tbody.replaceWith(newTbody);
}
const createRow = (item) =>{
  let table = document.getElementById('products');
  table.style.display = "table";
  document.getElementById('no-products-display').style.display = "none";
  let newElement = document.createElement('tr');
  let htmlProducto = `
    <td>${item.id}</td>
    <td>${item.title}</td>
    <td>${item.price}</td>
    <td>
      <img src=${item.thumbnail} width=35 height=35>
      </div>
    </td>
    `;
  newElement.innerHTML = htmlProducto;
  table.appendChild(newElement);
}
/*
socket.on('messages', function (data) {
  console.log('RECIBI MENSAJE');
  alert(JSON.stringify(data));
  render(data);
});
*/