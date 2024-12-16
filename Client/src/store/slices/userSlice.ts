import { createSlice, PayloadAction } from "@reduxjs/toolkit"; 
import { removeCookie } from "@/services/cookies";

interface UserState {
    isLogged: boolean;
    username: string;
    email: string;
    userId: string;
    userImage: string;
    likedRecipes: string[];
}
interface SetUserPayload {
    username: string;
    email: string;
    _id: string;
    userImage: string
    likedRecipes: string[];
}

interface RecipePayload {
    recipeId: string;
}

const initialState: UserState = {
    isLogged: false,
    username: "",
    email: "",
    userId: "",
    userImage: "",
    likedRecipes: [],
};

const userSlice = createSlice({
    name: "userLogged",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<SetUserPayload>) => {
            const { username, email, _id, userImage, likedRecipes } = action.payload;
        
            if (username && email && likedRecipes) {
                state.username = username;
                state.email = email;
                state.userId = _id;
                state.userImage = userImage;
                state.likedRecipes = likedRecipes;
                state.isLogged = true;
            } else {
                console.error("Invalid user data:", action.payload);
            }
        },
        unsetUser: (state) => {
        state.username = "";
        state.email = "";
        state.userId = "";
        state.userImage = "";
        state.likedRecipes = [];
        state.isLogged = false;
        removeCookie("token");
        },
        addLikedRecipe: (state, action: PayloadAction<RecipePayload>) => {
        const { recipeId } = action.payload;
        if (!state.likedRecipes.includes(recipeId)) {
            state.likedRecipes.push(recipeId);
        }
        },
        deleteLikedRecipe: (state, action: PayloadAction<RecipePayload>) => {
        const { recipeId } = action.payload;
        state.likedRecipes = state.likedRecipes.filter(
            (recipe) => recipe !== recipeId
        );
        },
    },
})

export const { setUser, unsetUser, addLikedRecipe, deleteLikedRecipe } = userSlice.actions;

export default userSlice.reducer;