import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Types
import { Recipe } from "@/types/recipeTypes";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
// Functions
import { addRecipeDB, editRecipeDB } from "@/services/api";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";

interface AddEditRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecipe?: Recipe;
  editRecipe: Recipe | null;
  setAddRecipe: React.Dispatch<React.SetStateAction<boolean>>;
  setEditRecipe: React.Dispatch<React.SetStateAction<Recipe | null>>;
}

const AddEditRecipeModal: React.FC<AddEditRecipeModalProps> = ({ isOpen, onClose, initialRecipe,setAddRecipe, editRecipe, setEditRecipe}) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const userLogged = useSelector((state: RootState) => state.userLogged);

  useEffect(() => {
    if (initialRecipe) {
      setTitle(initialRecipe.title);
      setImage(initialRecipe.image);
      setIngredients(initialRecipe.ingredients);
      setInstructions(initialRecipe.instructions);
      setNewCategory(initialRecipe.category.toLowerCase());
    } else {
      // Reset fields for adding a new recipe
      setTitle("");
      setImage("");
      setIngredients([]);
      setInstructions("");
      setNewCategory("");
    }
  }, [initialRecipe]);

  const handleAddEditRecipe = async () => {
    const recipeData: Recipe = {
      _id: initialRecipe?._id, // Include ID only if editing
      title,
      image,
      ingredients,
      instructions,
      category: newCategory,
      userId: userLogged.userId
    };
    try {
      if(editRecipe) {
        await editRecipeDB(recipeData);
      }
      else {
        await addRecipeDB(recipeData);
      }
    } catch(err) {
      console.log("Error add/edit recipe: " + err);
    }
    finally {
      setAddRecipe(false);
      setEditRecipe(null);
      window.location.reload();
    }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">{initialRecipe ? "Edit Recipe" : "Add Recipe"}</h2>
        
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-4" />
        <Input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} className="mb-4" />
        <Textarea placeholder="Ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value.split(","))} className="mb-4 min-h-24" />
        <Textarea placeholder="Instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} className="mb-4" />
        
        <Select value={newCategory} onValueChange={(value) => setNewCategory(value)}>
            <SelectTrigger className="w-fu mb-4">
                <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Soup">Soup</SelectItem>
                <SelectItem value="Side Dish">Side Dish</SelectItem>
                <SelectItem value="Appetizer">Appetizer</SelectItem>
                <SelectItem value="Main Course">Main Course</SelectItem>
                <SelectItem value="Salad">Salad</SelectItem>
                <SelectItem value="Dessert">Dessert</SelectItem>
                <SelectItem value="Beverage">Beverage</SelectItem>
            </SelectContent>
        </Select>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAddEditRecipe}>{initialRecipe ? "Update" : "Add"}</Button>
        </div>
      </div>
    </div>
  );
};

export default AddEditRecipeModal;
