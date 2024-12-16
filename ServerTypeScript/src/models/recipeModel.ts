import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipe extends Document {
    title: string;
    image: string;
    ingredients: string[];
    instructions: string;
    category: string;
    userId?: mongoose.Types.ObjectId; // Optional field to associate with a user
}

const RecipeSchema: Schema = new Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        image: { 
            type: String 
        },
        ingredients: { 
            type: [String], 
            required: true 
        },
        instructions: { 
            type: String, 
            required: true 
        },
        category: { 
            type: String, 
            required: true,
            enum: [
                'Main Course',
                'Side Dish',
                'Dessert',
                'Appetizer',
                'Beverage',
                'Salad',
                'Soup'
            ]
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            default: null 
        },
    },
    { timestamps: true } // created at, updated at
);

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);
