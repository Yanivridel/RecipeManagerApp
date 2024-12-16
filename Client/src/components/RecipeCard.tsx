import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Card } from "./ui/card";
import { Recipe } from "@/types/recipeTypes";
// Functions
import { getInitials, getInitialsColor } from "@/services/userServices";
//
import { Button } from "./ui/button";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { likeRecipeDB, unLikeRecipeDB } from "@/services/api";
import { addLikedRecipe, deleteLikedRecipe } from "@/store/slices/userSlice";


interface RecipeCardProps {
    recipe: Recipe;
    setEditRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
    setDeleteModal: React.Dispatch<React.SetStateAction<string>>;
}

export default function RecipeCard({ recipe, setEditRecipe, setDeleteModal } : RecipeCardProps ) {
    const [liked, setLiked] = useState(false);
    const userLogged = useSelector((state: RootState) => state.userLogged);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        setLiked(userLogged.likedRecipes.includes(recipe._id as string))
    }, [])

    const handleLike = async (recipeId: string) => {
            setLiked(!liked);
            if(!liked) {
                try {
                    await likeRecipeDB(recipeId);
                    dispatch(addLikedRecipe({recipeId}));
                } catch (err) {
                    console.log("failed liking recipe: " + err);
                }
            }
            else {
                try {
                    await unLikeRecipeDB(recipeId);
                    dispatch(deleteLikedRecipe({recipeId}));
                } catch (err) {
                    console.log("failed liking recipe: " + err);
                }
            }
    };

    return (
        <Card key={recipe._id} className="flex flex-col relative mb-6 p-4 min-w-60 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
                <Avatar className="w-12 h-12 rounded-full mr-4">
                <AvatarImage src={typeof recipe.userId === "object" && recipe.userId ? recipe.userId.userImage : ""}/>
                <AvatarFallback
                    style={{ backgroundColor: typeof recipe.userId === "object" && recipe.userId ? getInitialsColor(recipe.userId.username) : "#24947e"}}
                    >{typeof recipe.userId === "object" && recipe.userId ? getInitials(recipe.userId.username) : "ADMIN"}</AvatarFallback>
                </Avatar>
                <div>
                <h3 className="text-xl font-semibold">{typeof recipe.userId === "object" && recipe.userId ? recipe.userId.username : "Admin"}</h3>
                <span className="text-sm text-gray-500">{recipe.category}</span>
                </div>
            </div>
            {typeof recipe.userId === "object" && recipe.userId && userLogged.userId === recipe.userId._id &&
            <div className="absolute right-3 flex gap-2">
                <Button onClick={() => setEditRecipe(recipe)}>Edit</Button>
                <Button onClick={() => setDeleteModal(recipe._id as string)}>Delete</Button>
            </div>}

            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-4">{recipe.title}</h2>
                <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full mx-auto lg:w-3/6 h-56 object-contain rounded-md mb-2"
                />
            </div>

            <div className="flex justify-between items-center mt-4">
                <Button
                variant="outline"
                onClick={() => handleLike(recipe._id as string)}
                className="flex items-center"
                >
                    { liked ? "❤️" : "🤍"}
                </Button>
                <Button onClick={() => navigate(`/recipe/${recipe._id}`, { state: { recipe } })}>
                    More About this...
                </Button>
            </div>
    </Card>
    )
}