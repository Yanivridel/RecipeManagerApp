import { Recipe } from '@/types/recipeTypes';
import axios from 'axios';
import { getCookie } from './cookies';

const LOCAL_HOST = 'http://localhost:3000';
const SERVER_HOST = 'https://pokemonappserver.onrender.com';
const API_URL = LOCAL_HOST;


// Check user authentication
export const getSelf = async (token: string) => {
    try {
        const { data } = await axios.get(`${API_URL}/api/users/get-self`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        console.error('Auth check error:', error);
        throw error;
    }
};
interface checkLoginType {
    email: string;
    password: string;
}
export const checkLogin = async ({email, password}: checkLoginType) => {
    try {
        const { data } = await axios.post(`${API_URL}/api/users/login`, { email, password }, { withCredentials: true });
        return data;
    } 
    catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

interface createUserType {
    email: string;
    password: string;
    username: string;
}
export const createUser = async ({email, username, password}: createUserType) => {
    try {
        const { data } = await axios.post(`${API_URL}/api/users/signup`, { email, username, password });
        return data;
    } 
    catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

export const addRecipeDB = async (recipe: Recipe ) => {
    console.log(recipe)
    try {
        const { data } = await axios.post(`${API_URL}/api/recipes/add`, recipe, 
            {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`
                }
            });
        return data;
    } 
    catch (error) {
        console.error('Add recipe error:', error);
        throw error;
    }
}

export const editRecipeDB = async (recipe: Recipe ) => {
    try {
        const { data } = await axios.put(`${API_URL}/api/recipes/edit/${recipe._id}`, recipe, 
            {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`
                }
            });
        return data;
    } 
    catch (error) {
        console.error('Add recipe error:', error);
        throw error;
    }
}

export const deleteRecipeDB = async (recipeId: string ) => {
    try {
        const { data } = await axios.delete(`${API_URL}/api/recipes/delete/${recipeId}`, 
            {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`
                }
            });
        return data;
    } 
    catch (error) {
        console.error('Delete recipe error:', error);
        throw error;
    }
}

export const likeRecipeDB = async (recipeId: string) => {
    try {
        const { data } = await axios.post(`${API_URL}/api/users/like/${recipeId}`, {},
            {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`
                }
            });
        return data;
    } 
    catch (error) {
        console.error('Like recipe error:', error);
        throw error;
    }
}

export const unLikeRecipeDB = async (recipeId: string) => {
    try {
        const { data } = await axios.post(`${API_URL}/api/users/unlike/${recipeId}`, {},
            {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`
                }
            });
        return data;
    } 
    catch (error) {
        console.error('Unlike recipe error:', error);
        throw error;
    }
}
/*
export const changeUsername = async (email, username) => {
    try {
        const { data } = await axios.post(`${API_URL}/api/users/change/username`, {
            email,
            username,
        });
        return data;
    } catch (error) {
        console.error('Failed changing username:', error);
        throw error;
    }
}
*/