// Импортируем необходимые модули и компоненты
import AppState, { CatalogChangeEvent } from './components/appstate';
import Basket from './components/basket';
import Card from './components/card';
import { ContactForm } from './components/contactform';
import Order from './components/orderform';
import Page from './components/page';
import Product from './components/product';
import ShopApi from './components/shopapi';
import { EventEmitter } from './components/base/events';
import Modal from './components/common/modal';
import Success from './components/success';
import './scss/styles.scss';
import { IContactForm, IOrderForm } from './types';
import { API_URL, CDN_URL, PaymentTypes } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Создаем экземпляр API магазина с заданными URL
const api = new ShopApi(CDN_URL, API_URL);
// Создаем экземпляр эмиттера событий для управления событиями
const events = new EventEmitter();

// Логируем все события и их данные
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Получаем элементы шаблонов из HTML
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Находим элемент модального окна
const modal2 = document.querySelector('.modal');

// Создаем состояние приложения
const appState = new AppState({}, events);

// Создаем контейнеры для страницы и модального окна
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Создаем используемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events, {
	onClick: (ev: Event) => events.emit('payment:toggle', ev.target),
});
const contactForm = new ContactForm(cloneTemplate(contactsTemplate), events);

// Обрабатываем изменения в каталоге товаров
events.on<CatalogChangeEvent>('items:change', () => {
	page.gallery = appState.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			name: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Функция для получения товаров с сервера
function getItems() {
	api
		.getItemList()
		.then((catalog) => {
			appState.setCatalog(catalog); // Обновляем состояние приложения с полученными товарами
		})
		.catch((err) => {
			console.error(err); // Логируем ошибки
		});
}

getItems(); // Вызываем функцию для получения товаров

// Функция для блокировки прокрутки страницы при открытии модального окна
function blockModal() {
	page.locked = true;
}

// Функция для разблокировки прокрутки страницы
function unblockModal() {
	page.locked = false;
}

// Подписываемся на события открытия и закрытия модального окна
events.on('modal:open', blockModal);
events.on('modal:close', unblockModal);

// Обработка изменения предварительного просмотра карточки товара
const handlePreviewChanged = (item: Product) => {
	const card = new Card(cloneTemplate(previewTemplate), {
		onClick: () => {
			events.emit('product:toggle', item);
			card.buttonText =
				appState.basket.indexOf(item) < 0 ? 'В корзину' : 'Удалить из корзины';
		},
	});

	const buttonText =
		appState.basket.indexOf(item) < 0 ? 'В корзину' : 'Удалить из корзины';
	card.buttonText = buttonText; // Обновляем текст кнопки

	modal.render({
		// Отображаем карточку товара в модальном окне
		content: card.render({
			name: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			category: item.category,
			buttonTitle: buttonText,
		}),
	});
};

// Подписываемся на событие выбора карточки товара
events.on('card:select', handlePreviewChanged);

// Обработка события открытия корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render({}),
	});
});

// Обновление состояния при добавлении или удалении товара
events.on('product:toggle', (item: Product) => {
	if (appState.basket.indexOf(item) < 0) {
		events.emit('product:add', item);
	} else {
		events.emit('product:delete', item);
	}
});

// Добавление товара в корзину
events.on('product:add', (item: Product) => {
	appState.handleBasketAction('add', item);
});

// Удаление товара из корзины
events.on('product:delete', (item: Product) => {
	appState.handleBasketAction('remove', item);
});

// Обновление содержимого корзины при изменении
events.on('basket:changed', (items: Product[]) => {
	basket.items = items.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('product:delete', item); // Удаляем товар из корзины при нажатии
			},
		});
		return card.render({
			index: (index + 1).toString(),
			name: item.title,
			price: item.price,
		});
	});

	const total = items.reduce((total, item) => total + item.price, 0); // Вычисляем общую стоимость
	basket.total = total; // Обновляем общую стоимость в корзине
	appState.order.total = total; // Обновляем стоимость в заказе
	basket.toggleButton(total === 0); // Показываем/скрываем кнопку в зависимости от наличия товаров
});

// Обновление счетчика товаров в корзине
events.on('counter:changed', (item: string[]) => {
	page.counter = appState.basket.length; // Обновляем счетчик на странице
});

// Открытие формы контактов
events.on('contact:open', () => {
	modal.render({
		content: contactForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открытие формы заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработка изменений валидации формы заказа
events.on('orderErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address; // Устанавливаем валидность формы
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; '); // Обновляем ошибки
});

// Обработка изменений валидации формы контактов
events.on('formErrors:change', (errors: Partial<IContactForm>) => {
	const { phone, email } = errors;
	order.valid = !email && !phone; // Устанавливаем валидность формы
	contactForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; '); // Обновляем ошибки
});

// Подписка на изменения в полях формы заказа
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appState.setOrderForm(data.field, data.value);
	}
);

// Подписка на изменения в полях формы контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactForm; value: string }) => {
		appState.setContactForm(data.field, data.value);
	}
);

// Подписка на событие изменения предварительного просмотра
events.on('preview:changed', handlePreviewChanged);

// Обработка события заполнения формы заказа
events.on('order:ready', () => {
	order.valid = true; // Устанавливаем валидность формы
});

// Обработка события заполнения формы контактов
events.on('contact:ready', () => {
	contactForm.valid = true; // Устанавливаем валидность формы
});

// Подписка на событие отправки формы контактов
events.on('contacts:submit', handleOrderSubmit);

// Обработка отправки заказа
function handleOrderSubmit() {
	api
		.orderItems(appState.order) // Отправляем заказ на сервер
		.then((result) => {
			appState.clearBasket(); // Очищаем корзину
			appState.clearOrder(); // Очищаем заказ
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close(); // Закрываем модалку при нажатии
				},
			});
			success.description = result.total.toString(); // Устанавливаем описание успеха

			modal.render({
				// Отображаем сообщение об успешном заказе
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err); // Логируем ошибки
		});
}

// Обработка переключения типа оплаты
events.on('payment:toggle', (target: HTMLElement) => {
	if (!target.classList.contains('button_alt-active')) {
		order.toggleButton(target); // Переключаем состояние кнопки
		appState.order.payment = PaymentTypes[target.getAttribute('name')]; // Устанавливаем тип оплаты
		console.log(appState.order);
	}
});

// Обработка события открытия формы заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
	appState.order.items = appState.basket.map((item) => item.id); // Устанавливаем товары в заказе
});

// Подписка на событие отправки заказа
events.on('order:submit', () => {
	events.emit('contact:open'); // Открываем форму контактов
});
