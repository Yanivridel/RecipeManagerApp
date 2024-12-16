import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SelectValue } from "@radix-ui/react-select";
import { SkeletonCard, SkeletonDemo } from "@/components/Skeletons";
import AddEditRecipeModal from "@/components/AddEditRecipeModal";
// Types
import { Recipe } from "@/types/recipeTypes";
import { SquarePlus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { deleteRecipeDB } from "@/services/api";
import RecipeCard from "@/components/RecipeCard";

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [addRecipe, setAddRecipe] = useState(false);
    const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
    const [deleteModal, setDeleteModal ] = useState("");
    
    const [searchParams, setSearchParams] = useSearchParams({
        title: "",
        category: "all categories"
    })

    useEffect(() => {
        if(!searchParams.get("title")) searchParams.set("title", "");
        if(!searchParams.get("category")) searchParams.set("category", "all categories");
        setSearchParams(searchParams);

        axios.get("http://localhost:3000/api/recipes/all")
        .then((response) => {
        setRecipes(response.data);
        })
        .catch((error) => console.error("Error fetching recipes:", error));
    }, [searchParams]);

    const filteredRecipes = recipes.filter((recipe) => {
        const category = searchParams.get("category");
        const title = searchParams.get("title");

        const isCategoryMatch =
        category === "all categories" ||
        !category || recipe.category.toLowerCase() === category.toLowerCase();

        const isSearchMatch = !title || recipe.title.toLowerCase().includes(title.toLowerCase());

        return isCategoryMatch && isSearchMatch;
    });

    const handleSetText = (e: React.ChangeEvent<HTMLInputElement>) => {
        searchParams.set("title", e.target.value);
        setSearchParams(searchParams);
    }
    const handleSetCategory = (value: string) => {
        searchParams.set("category", value);
        setSearchParams(searchParams);
    }
    const handleDeleteRecipe = async () => {
        try {
            await deleteRecipeDB(deleteModal);
            console.log("recipe has been deleted: " + deleteModal);
            window.location.reload();
        } catch(err) {
            console.log("Error client delete recipe: " + err);
        }
        finally{
            setDeleteModal("");
        }
    }

    return (
    <div className="container mx-auto p-6 max-w-7xl">
        {/* Filter Section */}
        <div className="flex items-center justify-between mb-6 gap-1 flex-wrap xs:flex-nowrap">
            <Input
                placeholder="Search by title..."
                value={searchParams.get("title") || ""}
                onChange={(e) => handleSetText(e)}
                className="w-full md:w-1/3"
            />
            <Select
            value={searchParams.get("category") as string}
            onValueChange={(value) => handleSetCategory(value)}
            >
                <SelectTrigger className="w-[280px] mx-auto xs:mx-0">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all categories">All Categories</SelectItem>
                    <SelectItem value="soup">Soup</SelectItem>
                    <SelectItem value="side dish">Side Dish</SelectItem>
                    <SelectItem value="appetizer">Appetizer</SelectItem>
                    <SelectItem value="main course">Main Course</SelectItem>
                    <SelectItem value="salad">Salad</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                    <SelectItem value="beverage">Beverage</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button className="fixed bottom-10 right-10 z-50 w-10 h-10" onClick={() => setAddRecipe(true)}>
            <SquarePlus />
        </Button>
        {/* Add / Edit Modal */}
        {<AddEditRecipeModal
        isOpen={addRecipe || !!editRecipe}
        onClose={() => { setAddRecipe(false); setEditRecipe(null); }}
        initialRecipe={editRecipe || undefined}
        setAddRecipe={setAddRecipe}
        setEditRecipe={setEditRecipe}
        editRecipe={editRecipe}
        />}
        {/* Delete Modal */}
        { deleteModal && 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Delete Recipe</h2>
                <p>Are you sure you want to delete ?</p>
                <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteModal("")}>Cancel</Button>
                <Button onClick={handleDeleteRecipe}>Delete</Button>
                </div>
            </div>
        </div>
        }
        {/* Recipe Posts Section */}
        <div className="space-y-6">
        {!filteredRecipes ? 
        <div className="container flex flex-col items-center mx-auto p-6">
            {[1,2,3,4].map((el)=> 
            <div  key={el} className="space-y-4 my-5">
                <SkeletonDemo/>
                <SkeletonCard/>
            </div>)}
        </div>
        :
        filteredRecipes.map((recipe) => (
            <RecipeCard recipe={recipe} setDeleteModal={setDeleteModal} setEditRecipe={setEditRecipe}/>
        ))}
        </div>
    </div>
    );
}
