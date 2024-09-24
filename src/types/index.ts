// Основные типы данных

// Типы методов оплаты
export type PaymentsMethods = 'нал' | 'безнал'; // Определяет доступные методы оплаты: наличные и безналичные

// Типы категорий
export type CategoryType =
	| 'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'другое'
	| 'дополнительное'; // Перечисляет возможные категории товаров

// Интерфейс продукта
export interface IProduct {
	id: number; // Уникальный идентификатор товара
	name: string; // Название товара
	description: string; // Описание товара
	price: number | null; // Цена товара; может быть null, если цена не указана
	category: string; // Категория товара
	image: string; // URL изображения товара
}

// Интерфейс состояния приложения
export interface IAppState {
	catalog: IProduct[]; // Список всех товаров в каталоге
	order: IOrder | null; // Текущий заказ; может быть null, если заказа нет
	basket: IProduct[] | null; // Содержимое корзины; может быть null, если корзина пуста
	preview: string | null; // ID продукта для предварительного просмотра; может быть null, если ничего не выбрано
	loading: boolean; // Индикатор загрузки данных; true, если данные загружаются
}

// Интерфейс для формы заказа
export interface IOrderForm {
	payment: string; // Метод оплаты
	address: string; // Адрес доставки
}

// Интерфейс для формы контактов
export interface IContactForm {
	phone: string; // Номер телефона
	email: string; // Адрес электронной почты
}

// Интерфейс заказа, объединяющий формы заказа и контактов
export interface IOrder extends IOrderForm, IContactForm {
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

// Интерфейс карточек продуктов, расширяющий интерфейс продукта
export interface ICards extends IProduct {
	index?: string; // Индекс карточки в представлении; опциональный
	buttonTitle?: string; // Название кнопки для действий с карточкой; опциональный
}

// Интерфейс для представления корзины
export interface IBasketView {
	items: HTMLElement[]; // Список элементов HTML, представляющих товары в корзине
	total: number; // Общая сумма товаров в корзине
}

// Интерфейс страницы, содержащий элементы интерфейса
export interface IPage {
	counter: number; // Счетчик товаров в корзине
	gallery: HTMLElement[]; // Список элементов HTML для галереи товаров
}

// Интерфейс для описания действий
export interface IActions {
	onClick: (event: MouseEvent) => void; // Обработчик события клика
}

// Интерфейс результата заказа (повторно объявлен, возможно, стоит удалить дублирование)
export interface IOrderResult {
	id: string; // Уникальный идентификатор заказа
	total: number; // Общая сумма заказа
}
