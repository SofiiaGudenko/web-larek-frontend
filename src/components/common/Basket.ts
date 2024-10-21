import { IProduct, IBasket } from '../../types/index';
import { OrderForm } from './OrderForm';

export class Basket implements IBasket {
  items: string[] = [];
  total: number = 0;
  private modalElement: HTMLElement;
  private closeButton: HTMLElement;
  private contentElement: HTMLElement;
  private basketItems: IProduct[] = [];
  private totalElement: HTMLElement;
  private orderForm: OrderForm | null = null;
  private counterElement: HTMLElement;

  constructor(modalElementId: string) {
    this.modalElement = document.getElementById(modalElementId) as HTMLElement;
    this.closeButton = this.modalElement.querySelector('.modal__close') as HTMLElement;
    this.contentElement = this.modalElement.querySelector('.basket__list') as HTMLElement;
    this.totalElement = this.modalElement.querySelector('.basket__price') as HTMLElement;
    this.counterElement = document.querySelector('.header__basket-counter') as HTMLElement;

    this.initEvents();
  }

  private initEvents() {
    this.closeButton?.addEventListener('click', () => this.close());
    const orderButton = this.modalElement.querySelector('.basket__button') as HTMLElement;
    orderButton?.addEventListener('click', () => this.onOrder());
  }

  setOrderForm(orderForm: OrderForm) {
    this.orderForm = orderForm;
  }

  private onOrder() {
    if (this.basketItems.length > 0 && this.orderForm) {
      this.close();
      this.orderForm.open();
    } else {
      alert('Ваша корзина пуста.');
    }
  }

  getTotalAmount(): number {
    return this.total;
  }

  open() {
    this.renderBasketItems();
    this.modalElement.classList.add('modal_active');
  }

  close() {
    this.modalElement.classList.remove('modal_active');
  }

  addToBasket(product: IProduct) {
    this.basketItems.push(product);
    this.items.push(product.id.toString());
    this.updateTotal();
    this.updateCounter();
  }

  removeFromBasket(productId: number) {
    this.basketItems = this.basketItems.filter((item) => item.id !== productId);
    this.items = this.items.filter((id) => id !== productId.toString());
    this.updateTotal();
    this.updateCounter();
  }

  getItems(): string[] {
    return this.items;
  }

  public clearBasket() {
    this.basketItems = [];
    this.items = [];
    const basketList = document.querySelector('.basket__list') as HTMLElement;
    basketList.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
    this.updateTotal();
    this.updateCounter();
  }

  private renderBasketItems() {
    this.contentElement.innerHTML = '';
    if (this.basketItems.length === 0) {
      this.contentElement.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
      return;
    }

    this.basketItems.forEach((product, index) => {
      const basketItem = this.createBasketItem(product, index + 1);
      this.contentElement.appendChild(basketItem);
    });
  }

  private createBasketItem(product: IProduct, index: number): HTMLElement {
    const listItem = document.createElement('li');
    listItem.classList.add('basket__item', 'card', 'card_compact');
    listItem.innerHTML = `
      <span class="basket__item-index">${index}</span>
      <span class="card__title">${product.title}</span>
      <span class="card__price">${product.price} синапсов</span>
      <button class="basket__item-delete" aria-label="удалить"></button>
    `;
    listItem.querySelector('.basket__item-delete')?.addEventListener('click', () => {
      this.removeFromBasket(product.id);
      this.renderBasketItems();
    });
    return listItem;
  }

  private updateTotal() {
    this.total = this.basketItems.reduce((sum, item) => sum + (item.price || 0), 0);
    this.totalElement.textContent = `${this.total} синапсов`;
  }

  private updateCounter() {
    this.counterElement.textContent = this.basketItems.length.toString();
  }

  isInBasket(productId: number): boolean {
    return this.basketItems.some((item) => item.id === productId);
  }
}
