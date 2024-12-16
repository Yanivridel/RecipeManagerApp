import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb'; 
import userModel from "../models/userModel";
import jwt from 'jsonwebtoken';

// utils imports
import { hashPassword, comparePassword } from "../utils/auth";
import { AuthenticatedRequest } from 'src/types/expressTypes';
import recipeModel from './../models/recipeModel';
import mongoose from 'mongoose';

const JTW_EXPIRATION = { expiresIn: '1d'};

// CREATE USER - Done
interface CreateUserRequestBody {
    username: string;
    email: string;
    password: string;
    userImage: string | null;
}
export const createUser = async (req: Request<{/*params*/}, {/*res body*/}, CreateUserRequestBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, email, password, userImage } = req.body;
    
        if(!username || !email || !password) {
            res.status(400).send({status: "error", message: "Missing required parameters"});
            return;
        }
        
        const newUser = new userModel({
            username,
            email,
            password: await hashPassword(password),
            userImage,
        });
    
        await newUser.save();
    
        res.status(201).send({
            status: "success",
            message: "user created successfully",
        });
    } catch (error: unknown) {
        console.log(error); // dev mode
        if (error instanceof MongoError  && error.code === 11000) {
            res.status(409).json({
                status: "error",
                message: "email or username already exists",
            });
        }
        else {
            res.status(500).json({
                status: "error",
                message: "An unexpected error occurred",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

// LOGIN USER - Done
interface LoginUserRequestBody {
    email: string;
    password: string;
}
export const loginUser = async (req: Request<{},{}, LoginUserRequestBody>, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            res.status(400).send({status: "error", message: "Missing required parameters"});
            return;
        }
    
        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            res.status(404).send({status: "error", message: "User not found"});
            return;
        }
    
        const isCorrectPassword = await comparePassword(password,user.password);

        if (isCorrectPassword) {
            let jwtSecretKey = process.env.JWT_SECRET_KEY as string;
    
            const token = jwt.sign(
            {
                email: user.email,
            },
            jwtSecretKey,
            JTW_EXPIRATION
            );
    
            // Set the JWT as a cookie in the response.
            res.cookie("token", token, {
            httpOnly: false, // NOTE: For production, set this to `true` to prevent JavaScript access.
            secure: true, // Ensure the cookie is sent over HTTPS.
            sameSite: "strict", // Prevent cross-site requests.
            maxAge: 3600000, // Cookie lifespan of 1 hour (in milliseconds).
            });
            res.json({ 
                status: "succuss",
                message: "Logged in successfully", 
                token: token,
                user
            });
        } 
        else {
            // Send a 401 response if the password is incorrect.
            res.status(401).json({
                status: "error",
                message: "Invalid credentials",
            });
            return;
        }
    } catch (error: unknown) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred",
            error: error instanceof Error ? error.message: "Unknown",
        });
    }
}

// GET SELF TOKEN - Done
export const getSelf = async (req: Request, res: Response): Promise<void> => {
try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

    if(!req.headers.authorization) {
        res.status(400).send({status: "error", message: "Missing required authorization token"});
        return;
    }

    const token = req.headers.authorization.split(' ')[1]; // Extract the token from the `Authorization` header.
    const decoded = jwt.verify(token, jwtSecretKey) as { email: string };

    const user = await userModel.findOne({ email: decoded.email });

    res.send(user);
} catch (error) {
    console.log(error); // dev mode logging
    res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
    });
}
};

//  CHANGE USERNAME - Done
interface ChangeUsernameRequestBody {
    email: string;
    username: string;
}
export const changeUsername = async (req: Request<{},{}, ChangeUsernameRequestBody>, res: Response): Promise<void> => {
    try {
        const { email, username } = req.body;

        if(!email || !username) {
            res.status(400).send({status: "error", message: "Missing required parameters"});
            return;
        }

        const updatedUser = await userModel.findOneAndUpdate(
            { email },
            { username },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({
                status: "error",
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            status: "success",
            message: "Username updated successfully",
            user: {
                email: updatedUser.email,
                username: updatedUser.username,
            },
        });
    } catch (error) {
        console.log(error); // dev mode
        if (error instanceof MongoError  && error.code === 11000) {
            res.status(409).json({
                status: "error",
                message: "username already exists",
            });
        }
        else {
            res.status(500).json({
                status: "error",
                message: "An unexpected error occurred",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

//  LIKE RECIPE
export const likeRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
        const authenticatedReq = req as AuthenticatedRequest;
        const { userId } = authenticatedReq;
        const { id:recipeId } = req.params;

        if(!userId || !recipeId) {
            res.status(400).send({status: "error", message: "Missing required parameters"});
            return;
        }

        const recipe = await recipeModel.findById(recipeId);
        if (!recipe) {
            res.status(404).json({ status: "error", message: 'Recipe not found' });
            return
        }

        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ status: "error", message: 'User not found' });
            return;
        }

        if (!user.likedRecipes.includes(recipeId)) {
            user.likedRecipes.push(new mongoose.Types.ObjectId(recipeId).toString());
            await user.save();
            res.status(200).json({ message: 'Recipe liked successfully', likedRecipes: user.likedRecipes });
        } else {
            res.status(400).json({ status: "error", message: 'Recipe already liked' });
        }
    } catch (error) {
        console.log(error); // dev mode
        if (error instanceof MongoError) {
            res.status(409).json({
                status: "error",
                message: "Data Base Error",
                error: error.message
            });
        }
        else {
            res.status(500).json({
                status: "error",
                message: "An unexpected error occurred",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}


//  UNLIKE RECIPE
export const unlikeRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
        const authenticatedReq = req as AuthenticatedRequest;
        const { userId } = authenticatedReq;
        const { id:recipeId } = req.params;

        if(!userId || !recipeId) {
            res.status(400).send({status: "error", message: "Missing required parameters"});
            return;
        }

        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ status:"error", message: 'User not found' });
            return;
        }

        if (user.likedRecipes.includes(recipeId)) {
            user.likedRecipes = user.likedRecipes.filter((id) => id.toString() !== recipeId);
            await user.save();
            res.status(200).json({ status:"success", message: 'Recipe unliked successfully', likedRecipes: user.likedRecipes });
        } else {
            res.status(400).json({ status:"error", message: 'Recipe not found in liked list' });
        }
    } catch (error) {
        console.log(error); // dev mode
        if (error instanceof MongoError) {
            res.status(409).json({
                status: "error",
                message: "Data Base Error",
                error: error.message
            });
        }
        else {
            res.status(500).json({
                status: "error",
                message: "An unexpected error occurred",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}



// 
// export const getUserById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if(!id)
//             return res.status(400).send({status: "error", message: "Missing required parameters"});

//         const foundUser = await userModel.findById(req.params.id);

//         if (!foundUser)
//             return res.status("404").send({status: "error", message: "User not found"});

//         res.status(200).send({
//             status: "succuss",
//             user: foundUser
//         })
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "An unexpected error occurred",
//             error: error.message,
//         });
//     }
// }
// // 
// export const getAllUsers = async (req, res) => {
//     try {
//         const allFetchedUsers = await userModel.find().select("+password");

//         res.status(200).send({
//             status: "success",
//             message: "Users Found",
//             data: allFetchedUsers,
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "An unexpected error occurred",
//             error: error.message,
//         });
//     }
// };

// export const addFavPokemon = async (req, res) => {
//     const { email, pokemonName } = req.body;

//     if(!email || !pokemonName) 
//         return res.status(400).send({status: "error", message: "Missing required parameters"});

//     try {
//         const updatedUser = await userModel.findOneAndUpdate(
//         {email},
//         { $addToSet: { favPokemons: pokemonName } }, // $addToSet prevents duplicates
//         { new: true } // Return the updated document
//         );

//         if (!updatedUser) {
//         return res.status(404).send({ status: 'error', message: 'User not found' });
//         }

//         res.status(200).json({
//         status: 'success',
//         message: 'Favorite Pokémon added successfully',
//         data: updatedUser,
//         });

//     }
//     catch (error) {
//         res.status(500).json({
//             status: "error",
//             message: "An unexpected error occurred",
//             error: error.message,
//         });
//     }
// }

// export const deleteFavPokemon = async (req, res) => {
//     const { email, pokemonName } = req.body;
    
//     if (!email || !pokemonName) {
//         return res.status(400).send({ status: 'error', message: 'Missing required parameters' });
//     }

//     try {
//     const updatedUser = await userModel.findOneAndUpdate(
//         { email },
//         { $pull: { favPokemons: pokemonName } }, // $pull removes matching values from the array
//         { new: true } // Return the updated document
//     );

//     if (!updatedUser) {
//         return res.status(404).send({ status: 'error', message: 'User not found' });
//     }

//     res.status(200).json({
//         status: 'success',
//         message: 'Favorite Pokémon removed successfully',
//         data: updatedUser,
//     });
//     } catch (error) {
//     res.status(500).json({
//         status: 'error',
//         message: 'An unexpected error occurred',
//         error: error.message,
//     });
//     }
// };




