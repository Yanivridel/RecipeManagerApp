import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
// Functions
import { getInitials, getInitialsColor } from "@/services/userServices";
import { Recipe } from "@/types/recipeTypes";


const RecipeDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const recipe = location.state?.recipe as Recipe;

    return (
        <div className="container mx-auto p-6 max-w-5xl">
        <Card className="shadow-lg">
            <CardHeader>
            <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 rounded-full mr-4">
                <AvatarImage src={typeof recipe.userId === "object" && recipe.userId ? recipe.userId.userImage : ""}/>
                <AvatarFallback
                    style={{ backgroundColor: typeof recipe.userId === "object" && recipe.userId ? getInitialsColor(recipe.userId.username) : "#24947e"}}
                    >{typeof recipe.userId === "object" && recipe.userId ? getInitials(recipe.userId.username) : "ADMIN"}</AvatarFallback>
                </Avatar>
                <div>
                <h2 className="text-2xl font-semibold">{recipe.title}</h2>
                <p className="text-gray-500">Category: {recipe.category}</p>
                <p className="text-gray-500">
                    By: {typeof recipe.userId === "object" && recipe.userId ? recipe.userId?.username : "Admin"}
                </p>
                </div>
            </div>
            </CardHeader>

            <CardContent className="space-y-6">
            <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 object-contain rounded-md"
            />

            <div>
                <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
                <ScrollArea className="h-40 border rounded-md p-2">
                <ul className="list-disc pl-5 space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700">
                        {ingredient}
                    </li>
                    ))}
                </ul>
                </ScrollArea>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                {recipe.instructions}
                </p>
            </div>

            <Button variant="outline" onClick={() => navigate(-1)}>
                Back to Recipes
            </Button>
            </CardContent>
        </Card>
        </div>
    );
};

export default RecipeDetails;
