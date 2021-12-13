//Variáveis
const register = document.querySelector('.box1');
const list = document.querySelector('.box2');
const form = document.querySelector('.forms');
const apiUrl = 'https://estagio.eficazmarketing.com/api/user';
const registerBtn = document.querySelector('.registerBtn');
const listBtn = document.querySelector('.listBtn');
const table = document.querySelector('table');

//Lógica dos botões da navbar
registerBtn.addEventListener('click', () => {
  register.classList.remove('none');
  registerBtn.classList.add('activeNavbar');
  list.classList.add('none');
  listBtn.classList.remove('activeNavbar');
})

listBtn.addEventListener('click', () => {
  list.classList.remove('none');
  listBtn.classList.add('activeNavbar');
  register.classList.add('none');
  registerBtn.classList.remove('activeNavbar');
})

//Consumindo API
async function getContent() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

//Listando usuários
async function userList() {
  const users = await getContent();
  users.forEach(user => {
    const row = document.createElement('tr');

    const name = document.createElement('td');
    name.innerText = user.nome;
    row.appendChild(name);

    const email = document.createElement('td');
    email.innerText = user.email;
    row.appendChild(email);

    const address = document.createElement('td');
    address.innerHTML = `${user.rua}, ${user.numero}</br> ${user.complemento}</br> ${user.bairro}</br> ${user.cep}</br> ${user.cidade} - ${user.uf}`;
    row.appendChild(address);

    const phone = document.createElement('td');
    phone.innerText = user.telefone;
    row.appendChild(phone);

    const actionsContainer = document.createElement('td');
    const edit = document.createElement('button');
    edit.classList.add('btn');
    edit.classList.add('btnEdit');
    actionsContainer.classList.add('actions');
    actionsContainer.classList.add('flex');
    actionsContainer.classList.add('column');
    edit.innerHTML = `Editar`;
    actionsContainer.appendChild(edit);
    row.appendChild(actionsContainer);

    const remove = document.createElement('button');
    remove.classList.add('btn');
    remove.classList.add('btnDelete');
    remove.innerHTML = `Excluir`;
    actionsContainer.appendChild(remove);
    row.appendChild(actionsContainer);

    table.appendChild(row);

    userDelete(remove, user);
  });
}

userList();

//Registrando usuários
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = {};
  document.querySelectorAll('input').forEach(($input) => {
    const field = $input.id;
    data[field] = $input.value;
  })
  userRegister(data);
})

async function userRegister(data) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const { message } = await response.json();
    reloadPage();
    alert(message);

  } catch (e) {
    console.error(e);
  }
}

//Resetando o formulário
function reloadPage() {
  document.location.reload(true);
}

//Deletando usuários
function userDelete(remove, user, list, listBtn, register, registerBtn) {
  remove.addEventListener('click', async () => {
    try {
      const result = await fetch(`${apiUrl}/${user.id}`, {
        method: 'DELETE'
      })
      
      const { message } = await result.json(user);
      alert(message);

      reloadPage();
      
    } catch (e) {
      console.error(e);
    }
  })
}

//Máscaras
const masks = {
  cep(value) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
  },

  telefone(value) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  },

  uf(value) {
    return value
      .replace(/[^a-z]/ig, '')
      .toUpperCase();
  }
}

document.querySelectorAll('input').forEach(($input) => {
  const field = $input.id;
  $input.addEventListener('input', (e) => {
    e.target.value = masks[field](e.target.value)
  }, false)
})
