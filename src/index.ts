// src/index.ts
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { Basket } from './components/common/Basket';
import { OrderForm } from './components/common/OrderForm';
import { Api } from './components/base/api';
import { Model } from './components/base/Model';
import { Component } from './components/base/Component';
import { Modal } from './components/common/Modal';

document.addEventListener('DOMContentLoaded', () => {
  const api = new Api(API_URL);
  const model = new Model(api);
  const catalogContainer = document.querySelector('.gallery') as HTMLElement;
  const basket = new Basket('basket-modal');
  const orderForm = new OrderForm('order-modal', basket);
  
  basket.setOrderForm(orderForm);

  const modal = new Modal('modal-container', basket);
  
  if (catalogContainer) {
    const component = new Component(model, catalogContainer, modal);
    component.loadAndRenderProducts();
  }

  const basketIcon = document.querySelector('.header__basket') as HTMLElement;
  basketIcon?.addEventListener('click', () => {
    basket.open();
  });
});
