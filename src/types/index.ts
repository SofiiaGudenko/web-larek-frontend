// Основные типы данных

// Типы методов оплаты 
export type PaymentsMethods = 'нал' | 'безнал';

// Типы категорий
export type CategoryType = 'софт-скил' | 'хард-скил' | 'кнопка' | 'другое' | 'дополнительное';

// Интерфейс продукта
export interface IProduct {
  id: number; // Уникальный идентификатор товара
  name: string; // Название товара
  description: string; // Описание товара
  price: number | null; // Цена товара
  category: string; // Категория товара
  imageUrl: string; // URL изображения товара
}

// Интерфейс корзины
export interface BasketItem {
  productId: number; // Идентификатор товара
  quantity: number; // Количество товара в корзине
}


// Интерфейс контактов заказа
export interface IOrderContacts {
  email: string; // Email пользователя
  phone: string; // Номер телефона пользователя
}

// Интерфейс формы доставки заказа
export interface IOrderDeliveryForm {
  payment: PaymentsMethods; //Метод оплаты
  address: string; //Адрес доставки
}

// Интерфейс состояния приложения
export interface IAppState {
  catalog: IProduct[]; // Список товаров
  order: IOrder | null; // Текущий заказ
  basket: IProduct[] | null; // Содержимое корзины
  preview: string | null; // Превью товара
  loading: boolean; // Индикатор загрузки данных
}

// Интерфейс страницы
export interface IPage {
  counter: number; // Счетчик товаров
  store: HTMLElement[]; // Элементы страницы
  locked: boolean; // Блок элементов страницы
}

// Интерфейс карточки товара
export interface ICard {
  id: string; // Идентификатор карточки
  title: string; // Заголовок
  category: string; // Категория
  description: string; // Описание
  image: string; // Изображение
  price: number | null; // Цена
  selected: boolean; // Выбран товар или нет
  button: string; // Кнопка действия
}


// Интерфейс ошибок формы заказа, объединяющий контакты и доставку
export interface IOrderFormError extends IOrderContacts, IOrderDeliveryForm {}

// Интерфейс заказа, включающий элементы заказа и общую сумму
export interface IOrder extends IOrderFormError {
  items: string[]; // Товары в заказе
  total: number; // Общая сумма заказа
}

// Интерфейс успешного заказа
export interface IOrderSuccess {
  id: string; //Идентификатор заказа
  total: number; // Общая сумма заказа
}

// Интерфейс для API Ларек
export interface ILarekAPI {
  getProductList: () => Promise<IProduct[]>; // Получает список товаров
  getProduct: (id: string) => Promise<IProduct>; // Получает данные товара по идентификатору
  orderProduct: (order: IOrder) => Promise<IOrderSuccess>; // Отправляет заказ и получает результат
}

// Тип ошибок формы
export type FormError = Partial<Record<keyof IOrder, string>>;