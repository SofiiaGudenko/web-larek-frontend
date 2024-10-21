import { IProduct } from '../types/index';
import { cloneTemplate } from '../utils/utils';
import { CDN_URL } from '../utils/constants';
import { Modal } from './common/Modal';

export class Card {
	private product: IProduct;
	private modal: Modal;

	constructor(product: IProduct, modal: Modal) {
		this.product = product;
		this.modal = modal;
	}

	public render(): HTMLElement {
		const template = cloneTemplate<HTMLButtonElement>('#card-catalog');

		const titleElement = template.querySelector('.card__title') as HTMLElement;
		const categoryElement = template.querySelector(
			'.card__category'
		) as HTMLElement;
		const imageElement = template.querySelector(
			'.card__image'
		) as HTMLImageElement;
		const priceElement = template.querySelector('.card__price') as HTMLElement;

		if (titleElement) titleElement.textContent = this.product.title;
		if (categoryElement) categoryElement.textContent = this.product.category;
		if (imageElement) imageElement.src = `${CDN_URL}/${this.product.image}`;
		if (priceElement)
			priceElement.textContent = `${this.product.price} синапсов`;

		template.addEventListener('click', () => {
			this.modal.open(this.product);
		});

		return template;
	}
}
