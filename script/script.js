'use strict';
document.addEventListener('DOMContentLoaded', () => {

  const customer = document.getElementById('customer');
  const freelancer = document.getElementById('freelancer');
  const blockCustomer = document.getElementById('block-customer');
  const blockFreelancer = document.getElementById('block-freelancer');
  const blockChoice = document.getElementById('block-choice');
  const btnExit = document.getElementById('btn-exit');
  const ordersTable = document.getElementById('orders');
  const modalOrder = document.getElementById('order_read');
  const modalOrderActive = document.getElementById('order_active');
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  const formCustomer = document.getElementById('form-customer');

  const toStorage = () => {
    localStorage.setItem('orders', JSON.stringify(orders));
  };

  const declOfNum = (number, titles) => number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ? 2 :
    [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];

  const calcDeadline = data => {
    const deadline = new Date(data); // дата, до которой считаем.
    const today = Date.now(); // текущее время

    const remaining = (deadline - today) / 1000 / 60 / 60;
    //            миллисекунды / секунды / минуты / часы
    if (remaining / 24 > 2) {
      return declOfNum(Math.floor(remaining / 24), ['день', 'дня', 'дней']);
    }
    return declOfNum(Math.floor(remaining), ['час', 'часа', 'часов']);

  };

  const renderOrders = () => {
    ordersTable.innerHTML = '';

    orders.forEach((order, i) => {
      ordersTable.innerHTML += `
				<tr class="${order.active ? 'taken' : ''}" data-number-order="${i}">
					<td>${i + 1}</td>
					<td>${order.title}</td>
					<td class="${order.currency}"></td>
					<td>${calcDeadline(order.deadline)}</td>
				</tr>`;
    });
  };

  const handlerModal = event => {
    const target = event.target;
    const modal = target.closest('.order-modal');
    const order = orders[modal.id];

    const baseAction = () => {
      modal.style.display = 'none';
      toStorage();
      renderOrders();
    };

    if (target.closest('.close') || target === modal) {
      modal.style.display = 'none';
    }

    if (target.classList.contains('get-order')) {
      order.active = true;
      baseAction();
    }

    if (target.id === 'capitulation') {
      order.active = false;
      baseAction();
    }

    if (target.id === 'ready') {
      orders.splice(orders.indexOf(order), 1);
      baseAction();
    }


  };

  const openModal = numberOrder => {
    const order = orders[numberOrder];
    const { firstName, email, description, deadline, currency, amount, phone, active = false } = order;
    const modal = active ? modalOrderActive : modalOrder;
    modal.style.display = 'block';

    const firstNameBlock = modal.querySelector('.firstName');
    const emailBlock = modal.querySelector('.email');
    const descriptionBlock = modal.querySelector('.description');
    const deadlineBlock = modal.querySelector('.deadline');
    const currencyBlock = modal.querySelector('.currency_img');
    const countBlock = modal.querySelector('.count');
    const phoneBlock = modal.querySelector('.phone');

    modal.id = numberOrder;
    firstNameBlock.textContent = firstName;
    emailBlock.textContent = email;
    descriptionBlock.textContent = description;
    deadlineBlock.textContent = calcDeadline(deadline);
    currencyBlock.className = 'currency_img';
    currencyBlock.classList.add(currency);
    countBlock.textContent = amount;
    phoneBlock ? phoneBlock.href = `tel:${phone}` : '';

    modal.addEventListener('click', handlerModal);


  };

  formCustomer.addEventListener('submit', event => {
    event.preventDefault();
    const obj = {};
    for (const elem of formCustomer.elements) {
      if (elem.tagName === 'TEXTAREA' ||
        (elem.tagName === 'INPUT' && elem.type !== 'radio') ||
        (elem.type === 'radio' && elem.checked)) {

        obj[elem.name] = elem.value;

        if (elem.type !== 'radio') {
          elem.value = '';
        }
      }
    }

    orders.push(obj);
    toStorage();
  });


  customer.addEventListener('click', () => {
    blockChoice.style.display = 'none';
    blockCustomer.style.display = 'block';
    btnExit.style.display = 'block';

  });

  freelancer.addEventListener('click', () => {
    blockChoice.style.display = 'none';
    blockFreelancer.style.display = 'block';
    btnExit.style.display = 'block';
    renderOrders();
  });

  btnExit.addEventListener('click', () => {
    btnExit.style.display = 'none';
    blockChoice.style.display = 'block';
    blockFreelancer.style.display = 'none';
    blockCustomer.style.display = 'none';
  });

  ordersTable.addEventListener('click', event => {
    const target = event.target;
    const targetOrder = target.closest('tr');

    if (targetOrder) {
      openModal(targetOrder.dataset.numberOrder);
    }

  });


});
