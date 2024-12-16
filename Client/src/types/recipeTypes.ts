import { User } from "./userTypes";


export interface Recipe {
    _id?: string;
    userId: User | string | null;
    title: string;
    image: string;
    ingredients: string[];
    instructions: string;
    category: string;
}