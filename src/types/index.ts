// Основные типы данных

// Типы методов оплаты
export type PaymentsMethods = 'нал' | 'безнал';

// Типы категорий
export type CategoryType =
	| 'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'другое'
	| 'дополнительное'; 

// Интерфейс продукта
export interface IProduct {
	id: number; // Уникальный идентификатор товара
	description: string; // Описание товара
	image: string; // URL изображения товара
	title: string; // Название товара
	category: CategoryType; // Категория товара
	price: number | null; // Цена товара; может быть null, если цена не указана
}

// Интерфейс заказа
export interface IOrder {
	payment: PaymentsMethods; // Метод оплаты
	address: string; // Адрес доставки
	phone: string; // Номер телефона
	email: string; // Адрес электронной почты
	total: number; // Общая сумма заказа
	items: string[]; // Список ID товаров в заказе
}

// Тип для ошибок формы
export type FormErrors = Partial<Record<keyof IOrder, string>>; // Ошибки, связанные с полями формы заказа; может содержать строки для каждого поля

// Интерфейс результата заказа
export interface IOrderResult {
	id: string; // Уникальный идентификатор заказа
	total: number; // Общая сумма заказа
}

// Интерфейс для представления корзины
export interface IBasket {
	items: string[]; // Список элементов HTML, представляющих товары в корзине
	total: number; // Общая сумма товаров в корзине
}

// Интерфейс страницы, содержащий элементы интерфейса
export interface IPage {
	counter: number; // Счетчик товаров в корзине
	gallery: HTMLElement[]; // Список элементов HTML для галереи товаров
}