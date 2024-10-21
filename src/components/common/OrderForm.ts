import { Basket } from './Basket';
import { IOrder, PaymentsMethods, FormErrors, IOrderResult } from '../../types/index';

export class OrderForm {
  private modalElement: HTMLElement;
  private closeButton: HTMLElement | null;
  private addressInput: HTMLInputElement | null;
  private nextButton: HTMLButtonElement | null;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private selectedPaymentMethod: PaymentsMethods | null = null;
  private errorElement: HTMLElement | null;
  private basket: Basket;
  private formErrors: FormErrors = {};

  constructor(modalElementId: string, basket: Basket) {
    this.modalElement = document.getElementById(modalElementId) as HTMLElement;
    this.closeButton = this.modalElement.querySelector('.modal__close');
    this.addressInput = this.modalElement.querySelector('input[name="address"]');
    this.nextButton = this.modalElement.querySelector('.button.order__button');
    this.paymentButtons = this.modalElement.querySelectorAll('.order__buttons .button_alt');
    this.errorElement = this.modalElement.querySelector('.form__errors');
    this.basket = basket;

    this.initEvents();
  }

  private initEvents() {
    this.closeButton?.addEventListener('click', () => this.close());
    this.paymentButtons.forEach((button) =>
      button.addEventListener('click', () => this.selectPaymentMethod(button))
    );
    this.addressInput?.addEventListener('input', () => this.updateButtonState());
    this.nextButton?.addEventListener('click', (event) => {
      event.preventDefault();
      this.validateAndProceed();
    });
  }

  open() {
    this.resetForm();
    this.modalElement.classList.add('modal_active');
  }

  close() {
    this.modalElement.classList.remove('modal_active');
  }

  private selectPaymentMethod(button: HTMLButtonElement) {
    this.selectedPaymentMethod = button.textContent?.trim() as PaymentsMethods;
    this.paymentButtons.forEach((btn) => btn.classList.remove('selected'));
    button.classList.add('selected');
    this.errorElement?.classList.add('hidden');
    this.updateButtonState();
  }

  private updateButtonState() {
    const addressValue = this.addressInput?.value.trim();
    const isValid = this.selectedPaymentMethod && addressValue;

    if (isValid) {
      this.nextButton?.removeAttribute('disabled');
    } else {
      this.nextButton?.setAttribute('disabled', 'true');
    }
  }

  private validateAndProceed() {
    const addressValue = this.addressInput?.value.trim();

    if (!this.selectedPaymentMethod) {
      this.showError('Выберите способ оплаты');
      return;
    }

    if (!addressValue) {
      this.showError('Введите адрес доставки');
      return;
    }

    this.showStepTwo();
  }

  private showStepTwo() {
    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    const contactsForm = contactsTemplate.content.cloneNode(true) as HTMLElement;

    this.modalElement.querySelector('.modal__content')?.replaceChildren(contactsForm);

    const emailInput = this.modalElement.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = this.modalElement.querySelector('input[name="phone"]') as HTMLInputElement;
    const payButton = this.modalElement.querySelector('.button[type="submit"]') as HTMLButtonElement;

    emailInput?.addEventListener('input', () =>
      this.validateEmailPhone(emailInput, phoneInput, payButton)
    );
    phoneInput?.addEventListener('input', () =>
      this.validateEmailPhone(emailInput, phoneInput, payButton)
    );
    payButton?.addEventListener('click', (event) => {
      event.preventDefault();
      this.onPayment();
    });
  }

  private validateEmailPhone(
    emailInput: HTMLInputElement,
    phoneInput: HTMLInputElement,
    payButton: HTMLButtonElement
  ) {
    const isValid = emailInput.value.trim() && phoneInput.value.trim();

    if (isValid) {
      payButton.removeAttribute('disabled');
    } else {
      payButton.setAttribute('disabled', 'true');
    }
  }

  private showError(message: string) {
    if (this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.classList.remove('hidden');
    }
  }

  private onPayment() {
    const items = this.basket.getItems();
    const order: IOrder = {
        payment: this.selectedPaymentMethod as PaymentsMethods,
        address: this.addressInput?.value || '',
        phone: '',
        email: '', 
        total: this.basket.getTotalAmount(),
        items,
    };

    this.showSuccessMessage(order);
    this.basket.clearBasket();
}

private showSuccessMessage(order: IOrder) {
    const successTemplate = document.getElementById('success') as HTMLTemplateElement;
    const successMessage = successTemplate.content.cloneNode(true) as HTMLElement;

    const descriptionElement = successMessage.querySelector('.order-success__description');
    if (descriptionElement) {
        descriptionElement.textContent = `Списано ${order.total} синапсов`;
    }

    this.modalElement.querySelector('.modal__content')?.replaceChildren(successMessage);

    const closeButton = this.modalElement.querySelector('.order-success__close') as HTMLElement;
    closeButton.addEventListener('click', () => {
        this.close();
        window.location.reload();
    });
}

  private clearBasket() {
    this.basket.clearBasket();
  }

  private resetForm() {
    this.selectedPaymentMethod = null;
    this.paymentButtons.forEach((btn) => btn.classList.remove('selected'));
    this.errorElement?.classList.add('hidden');
    this.nextButton?.setAttribute('disabled', 'true');
  }
}
