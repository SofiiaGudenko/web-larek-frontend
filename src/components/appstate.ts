import {
	FormErrors,
	IAppState,
	IContactForm,
	IOrder,
	IOrderForm,
	IProduct,
} from '../types';
import Product from './product';
import { Model } from './base/model';
import Card from './card';

// Определение типа события изменения каталога
export type CatalogChangeEvent = {
	catalog: IProduct[]; // Содержит массив продуктов
};

// Класс состояния приложения, наследующий от базовой модели
export default class AppState extends Model<IAppState> {
	basket: Product[] = []; // Корзина, содержащая добавленные продукты
	catalog: Product[]; // Каталог продуктов
	loading: boolean; // Флаг загрузки
	order: IOrder = {
		// Заказ с начальными значениями
		payment: 'online',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	preview: string | null; // Предварительный просмотр продукта
	formErrors: FormErrors = {}; // Ошибки формы
	currentCard: Card | null = null; // Текущая карточка

	// Обновление состояния корзины и эмитирование событий
	refreshBasket() {
		this.emitChanges('counter:changed', this.basket); // Эмитирует изменение счетчика товаров в корзине
		this.emitChanges('basket:changed', this.basket); // Эмитирует изменение состояния корзины
	}

	// Очистка корзины
	clearBasket() {
		this.basket = []; // Устанавливаем корзину в пустой массив
		this.refreshBasket(); // Обновляем состояние корзины
	}

	// Очистка заказа
	clearOrder() {
		this.order = {
			// Устанавливаем значения заказа по умолчанию
			payment: 'online',
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}

	// Установка каталога продуктов
	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new Product(item, this.events)); // Преобразуем массив продуктов в экземпляры класса Product
		this.emitChanges('items:change', { catalog: this.catalog }); // Эмитируем изменение каталога
	}

	// Установка продукта для предварительного просмотра
	setPreview(item: Product) {
		this.preview = item.id; // Сохраняем ID продукта для предварительного просмотра
		this.emitChanges('preview:changed'); // Эмитируем изменение предварительного просмотра
	}

	// Установка значений в форме контактов
	setContactForm(field: keyof IContactForm, value: string) {
		this.order[field] = value; // Устанавливаем значение в соответствующее поле заказа
		if (this.validateContactForm()) {
			// Проверка валидации формы
			this.events.emit('contact:ready', this.order); // Эмитируем событие готовности формы
		}
	}

	// Установка значений в форме заказа
	setOrderForm(field: keyof IOrderForm, value: string) {
		this.order[field] = value; // Устанавливаем значение в соответствующее поле заказа
		if (this.validateOrderForm()) {
			// Проверка валидации формы
			this.events.emit('order:ready', this.order); // Эмитируем событие готовности формы
		}
	}

	// Валидация формы контактов
	validateContactForm() {
		const errors: typeof this.formErrors = {}; // Объект для хранения ошибок
		if (!this.order.email) {
			// Проверка наличия email
			errors.email = 'Необходимо указать email'; // Добавляем ошибку
		}
		if (!this.order.phone) {
			// Проверка наличия телефона
			errors.phone = 'Необходимо указать телефон'; // Добавляем ошибку
		}
		this.formErrors = errors; // Обновляем ошибки формы
		this.events.emit('formErrors:change', this.formErrors); // Эмитируем изменение ошибок формы
		return Object.keys(errors).length === 0; // Возвращаем true, если нет ошибок
	}

	// Валидация формы заказа
	validateOrderForm() {
		const errors: typeof this.formErrors = {}; // Объект для хранения ошибок
		if (!this.order.address) {
			// Проверка наличия адреса
			errors.address = 'Необходимо указать адрес доставки'; // Добавляем ошибку
		}
		this.formErrors = errors; // Обновляем ошибки формы
		this.events.emit('orderErrors:change', this.formErrors); // Эмитируем изменение ошибок формы
		return Object.keys(errors).length === 0; // Возвращаем true, если нет ошибок
	}

	// Обработка действий с корзиной (добавление или удаление товара)
	handleBasketAction(action: string, item: Product): void {
		switch (action) {
			case 'add': // Добавление товара
				if (!this.basket.includes(item)) {
					// Проверяем, что товар не уже в корзине
					this.basket.push(item); // Добавляем товар в корзину
				}
				break;
			case 'remove': // Удаление товара
				this.basket = this.basket.filter((el) => el !== item); // Удаляем товар из корзины
				break;
			default:
				break;
		}

		this.refreshBasket(); // Обновляем состояние корзины
	}
}
