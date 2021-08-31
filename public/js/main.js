const socket = io.connect('http://localhost:8080', { forceNew: true });
const form = document.getElementById('product-form');
const chatForm = document.getElementById('chat-form');
const message = document.getElementById('message');
const chatMessages = document.getElementById('chat-messages');

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


//CHAT IMPLEMENTATION

console.log("chat", chatForm);
socket.emit('joinedRoom');

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let data = {
    'mail': e.target[0].value,
    'message': e.target[1].value,
    'date': Date(),
  }

  //Emit Message to the server
  socket.emit('sendChatMessage', data);

  //Clear submitted message
  message.value = '';
});

socket.on('loadMessages', (messages)=>{
  messages.forEach(msg=>{
    createMessageHtml(msg)
  })
})
socket.on('sendLastMessage', (message) =>{
  createMessageHtml(message);
})



let createMessageHtml = (msg) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
  <p class="meta">${msg.mail} <span> ${msg.date}</span></p>
  <p class="text"> ${msg.message} </p>`;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
