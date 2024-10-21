import { IProduct } from '../../types/index';
import { CDN_URL, cardCategory } from '../../utils/constants';
import { Basket } from './Basket';

export class Modal {
	private modalElement: HTMLElement;
	private closeButton: HTMLElement;
	private contentElement: HTMLElement;
	private basket: Basket;

	constructor(modalElementId: string, basket: Basket) {
		this.modalElement = document.getElementById(modalElementId) as HTMLElement;
		this.closeButton = this.modalElement.querySelector(
			'.modal__close'
		) as HTMLElement;
		this.contentElement = this.modalElement.querySelector(
			'.modal__content'
		) as HTMLElement;
		this.basket = basket;

		this.initEvents();
	}

	private initEvents() {
		this.closeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.close();
		});

		this.modalElement.addEventListener('click', (event) => {
			if (event.target === this.modalElement) {
				this.close();
			}
		});
	}

	open(product: IProduct) {
		const isInBasket = this.basket.isInBasket(product.id);
		const buttonText = isInBasket ? 'Удалить из корзины' : 'В корзину';
		const categoryClass =
			cardCategory[product.category] || 'card__category_other';
		const imageUrl = `${CDN_URL}/${product.image}`;

		this.contentElement.innerHTML = `
      <div class="card card_full">
        <img class="card__image" src="${imageUrl}" alt="${product.title}" />
        <div class="card__column">
          <span class="card__category ${categoryClass}">${product.category}</span>
          <h2 class="card__title">${product.title}</h2>
          <p class="card__text">${product.description}</p>
          <div class="card__row">
            <button class="button action-button">${buttonText}</button>
            <span class="card__price">${product.price} синапсов</span>
          </div>
        </div>
      </div>
    `;

		this.modalElement.classList.add('modal_active');

		const actionButton = this.contentElement.querySelector(
			'.action-button'
		) as HTMLElement;
		actionButton.addEventListener('click', () => {
			if (isInBasket) {
				this.basket.removeFromBasket(product.id);
				this.close();
			} else {
				this.basket.addToBasket(product);
				this.close();
			}
		});
	}

	close() {
		this.modalElement.classList.remove('modal_active');
	}
}
