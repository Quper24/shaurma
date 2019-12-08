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
	const orders = [];

	const formCustomer = document.getElementById('form-customer');

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
		console.log(orders)

	});

	const renderOrders = () => {
		//ordersTable.innerHTML = '';

		orders.forEach((order, i)=> {
			ordersTable.innerHTML += `
				<tr data-number-order="${i}">
					<td>${i+1}</td>
					<td>${order.title}</td>
					<td class="${order.currency}"></td>
					<td>${order.deadline}</td>
				</tr>`;
		});
	};


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
			console.log(targetOrder.classList.contains('taken'));
			openModal(orders[targetOrder.dataset.numberOrder], targetOrder.classList.contains('taken'));
		}

	});


});