import { IProduct } from "../types";
import { Model } from "./base/model";

export default class Product extends Model<IProduct> {
    id: string;
    description: string;
    title: string;
    image: string;
    price: number | null;
    category: string;
    quantity: number;
}