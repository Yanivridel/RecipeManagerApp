import express, { Request, Response } from "express";
import {
    // getAllUsers,
    createUser,
    loginUser,
    getSelf,
    // getUserById,
    changeUsername,
    likeRecipe,
    unlikeRecipe,
} from '../controllers/userController';
import { authenticateToken } from "./../middleware/authMiddleware";

const router = express.Router();

// router.get("/all", (req: Request, res: Response) => getAllUsers(req, res));

router.post("/signup", createUser);

router.post('/login', loginUser);

router.get('/get-self', getSelf);

// router.get('/:id', (req: Request, res: Response) => getUserById(req, res));

router.post('/change/username', changeUsername);

router.post('/like/:id', authenticateToken, likeRecipe);

router.post('/unlike/:id', authenticateToken, unlikeRecipe);

export default router;
