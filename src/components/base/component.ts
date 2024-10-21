import { Model } from './Model';
import { IProduct, IPage } from '../../types/index';
import { Card } from '../Card';
import { Modal } from '../common/Modal';

export class Component implements IPage {
	counter: number = 0;
	gallery: HTMLElement[] = [];

	private model: Model;
	private catalogContainer: HTMLElement;
	private modal: Modal;

	constructor(model: Model, catalogContainer: HTMLElement, modal: Modal) {
		this.model = model;
		this.catalogContainer = catalogContainer;
		this.modal = modal;
	}

	async loadAndRenderProducts() {
		const products = await this.model.getProducts();
		this.renderProducts(products);
	}

	private renderProducts(products: IProduct[]) {
		this.catalogContainer.innerHTML = '';
		this.gallery = products.map((product) => {
			const card = new Card(product, this.modal);
			const cardElement = card.render();
			this.catalogContainer.appendChild(cardElement);
			return cardElement;
		});
	}

	updateCounter(newCount: number) {
		this.counter = newCount;
		const counterElement = document.querySelector('.header__basket-counter') as HTMLElement;
		counterElement.textContent = this.counter.toString();
	}
}
