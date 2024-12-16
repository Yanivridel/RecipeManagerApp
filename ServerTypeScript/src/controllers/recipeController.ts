import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import mongoose from 'mongoose'; 
import recipeModel from "../models/recipeModel";
import { AuthenticatedRequest } from 'src/types/expressTypes';

// GET ALL RECIPES - Done ? add populate users
export const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, title } = req.query;

        const filter: any = {};

        if (category) {
            filter.category = category;
        }

        if (title) {
        filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        }

        const recipes = await recipeModel.find(filter).populate("userId");

        res.json(recipes);

    } catch (error) {
        console.log(error); // dev mode
        if (error instanceof MongoError) {
            res.status(500).json({
                status: 'error',
                message: 'A database error occurred.',
                error: error.message
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred.',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

// GET RECIPE BY ID - Done
export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if(!id) {
            res.status(400).send({status: "error", message: "Missing required parameters (id)"});
            return;
        }

        const recipe = await recipeModel.findById(req.params.id).populate("userId");

        if (!recipe) {
            res.status(404).json({ message: 'Recipe not found' });
            return;
        }

        res.json(recipe);

    } catch (error) {
        console.log(error); // dev mode
        if (error instanceof MongoError) {
            res.status(500).json({
                status: 'error',
                message: 'A database error occurred.',
                error: error.message
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred.',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

// ADD RECIPE - Done

export const addRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
        const authenticatedReq = req as AuthenticatedRequest;
        const { title, image, ingredients, instructions, category } = req.body;
        const userId = authenticatedReq.userId;

        if(!title || !image || !ingredients || !instructions || !category) {
            res.status(400).send({status: "error", message: "Missing required parameters"});
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).send({status: "error", message: "Invalid userId"});
            return;
        }
    
        const newRecipe = new recipeModel({
            title,
            image,
            ingredients,
            instructions,
            category,
            userId: new mongoose.Types.ObjectId(userId), // Associate with the logged-in user
        });
    
        const savedRecipe = await newRecipe.save();
        res.status(201).json({
            status: "success",
            message: "The recipe saved successfully",
            data: savedRecipe
        });

    } catch (error) {
        console.log(error); // dev mode
        if (error instanceof MongoError) {
            res.status(500).json({
                status: 'error',
                message: 'A database error occurred.',
                error: error.message
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred.',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

// EDIT RECIPE - Done
export const editRecipeById = async (req: Request, res: Response): Promise<void> => { 
    try {
        const authenticatedReq = req as AuthenticatedRequest;
        const { id: recipeId } = req.params;

        if(!recipeId) {
            res.status(400).send({status: "error", message: "Missing required parameters (id)"});
            return;
        }

        const recipe = await recipeModel.findById(recipeId);
    
        if (!recipe) {
            res.status(404).json({status:"error", message: 'Recipe not found' });
            return;
        }

        if (!recipe.userId || recipe.userId.toString() !== authenticatedReq.userId.toString()) {
            res.status(403).json({status:"error", message: 'You are not authorized to edit this recipe' });
            return;
        }
    
        const updatedData = req.body;
        const updatedRecipe = await recipeModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    
        res.json(updatedRecipe);

    } catch (error) {
        console.log(error); // dev mode
        if (error instanceof MongoError) {
            res.status(500).json({
                status: 'error',
                message: 'A database error occurred.',
                error: error.message
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred.',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

// DELETE RECIPE - Done
export const deleteRecipeById = async (req: Request, res: Response): Promise<void> => { 
    try {
        const authenticatedReq = req as AuthenticatedRequest;
        const { id: recipeId } = req.params;

        if(!recipeId) {
            res.status(400).send({status: "error", message: "Missing required parameters (id)"});
            return;
        }

        const recipe = await recipeModel.findById(recipeId);

        if (!recipe) {
            res.status(404).json({status:"error", message: 'Recipe not found' });
            return;
        }

        if (!recipe.userId || recipe.userId.toString() !== authenticatedReq.userId.toString()) {
            res.status(403).json({ status:"error",  message: 'You are not authorized to delete this recipe' });
            return;
        }

    await recipe.deleteOne();

    res.json({status: "success", message: 'Recipe deleted successfully' });

    } catch (error) {
        console.log(error); // dev mode
        if (error instanceof MongoError) {
            res.status(500).json({
                status: 'error',
                message: 'A database error occurred.',
                error: error.message
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred.',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

// GET ALL USER RECIPES
export const getRecipesByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        if(!userId) {
            res.status(400).send({status: "error", message: "Missing required parameters (id)"});
            return;
        }
    
        const recipes = await recipeModel.find({ userId });
    
        if (!recipes.length) {
            res.status(404).json({ status: "error", message: "No recipes found for this user" });
            return;
        }

        res.json({ data: recipes });

    } catch (error) {
        console.log(error); // dev mode
        if (error instanceof MongoError) {
            res.status(500).json({
                status: 'error',
                message: 'A database error occurred.',
                error: error.message
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred.',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
};