import { Api, ApiListResponse } from './api';
import { IProduct } from '../../types/index';

export class Model {
	private api: Api;

	constructor(api: Api) {
		this.api = api;
	}

	async getProducts(): Promise<IProduct[]> {
		try {
			const response = (await this.api.get(
				'/product/'
			)) as ApiListResponse<IProduct>;
			return response.items;
		} catch (error) {
			console.error('Ошибка', error);
			return [];
		}
	}
}
