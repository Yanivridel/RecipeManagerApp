import express, { Request, Response } from "express";
import {
    getAllRecipes,
    getRecipeById,
    addRecipe,
    editRecipeById,
    deleteRecipeById,
    getRecipesByUser,
} from '../controllers/recipeController';
import { authenticateToken } from "./../middleware/authMiddleware";

const router = express.Router();


router.get("/all", getAllRecipes);

router.get('/:id', getRecipeById);

router.post('/add', authenticateToken, addRecipe);

router.put('/edit/:id', authenticateToken, editRecipeById);

router.delete('/delete/:id', authenticateToken, deleteRecipeById);

router.get('/user/:id', getRecipesByUser);





export default router;
