import { useState, useEffect, useRef } from "react";

import RecipeForm from "./RecipeForm";
import CategoryModal from "./components/modals/CategoryModal";
import RecipesToolbar from "./components/RecipesToolbar";
import CategoriesView from "./views/categories/CategoriesView";
import CategoryView from "./views/category/CategoryView";
import RecipesListView from "./views/list/RecipesListView";
import useRecipes from "../../../hooks/useRecipes";
import { getRecipeWord } from "../../../utils/recipeUtils";

import type { Category } from "../../../types/category";
import type { Recipe } from "../../../types/recipe";
import type { User } from "../../../types/user";
import type { ViewMode } from "../../../types/ui";

import "./styles/Recipes.css";

type RecipesProps = {
  user: User;
};

const Recipes = ({ user }: RecipesProps) => {
  const [filter, setFilter] = useState("");

  const {
    filteredRecipes,
    groupedRecipes,
    categoriesToDisplay,
    addRecipe,
    editRecipe,
    removeRecipe,
    addCategory,
    editCategory,
    removeCategory
  } = useRecipes(filter);

  const [editingRecipeId, setEditingRecipeId] = useState<number | null>(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>("categories"); // "categories" | "category" | "all"
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // close suggestions dropdown when clicking outside search input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToTop = () => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const toggleRecipe = (id: number) => {
    setExpandedRecipeId(prev => (prev === id ? null : id));
    setEditingRecipeId(null);
  };

  const handleRecipeSubmit = async (recipeData: Recipe) => {
    try {
      if (editingRecipeId) {
        await editRecipe(editingRecipeId, recipeData);
        setEditingRecipeId(null);
      } else {
        await addRecipe(recipeData);
        setShowAddForm(false);
      }

      setExpandedRecipeId(null);

    } catch (err) {
      console.error("Błąd zapisu przepisu:", err);
    }
  };

  const handleRecipeDelete = async (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć przepis?")) {
      await removeRecipe(id);
    }
  };

  const openAddCategoryModal = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setCategoryToEdit(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (name: string) => {
    try {
      if (categoryToEdit) {
        await editCategory(categoryToEdit.id, name);
      } else {
        await addCategory(name);
      }

      setIsCategoryModalOpen(false);
      setCategoryToEdit(null);

    } catch {
      alert("Błąd zapisu kategorii");
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToEdit) return;

    try {
      await removeCategory(categoryToEdit.id);

      setIsCategoryModalOpen(false);
      setCategoryToEdit(null);

    } catch {
      alert("Błąd usuwania");
    }
  };

  return (
    <div className="component">
      <h2>Przepisy</h2>

      {/* TOOLBAR */}
      <RecipesToolbar
        filter={filter}
        setFilter={setFilter}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        filteredRecipes={filteredRecipes}
        setViewMode={setViewMode}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        viewMode={viewMode}
        scrollToTop={scrollToTop}
        scrollToBottom={scrollToBottom}
        searchRef={searchRef}
      />

      {showAddForm && (
        <RecipeForm
          onSubmit={handleRecipeSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* CATEGORIES GRID */}
      {viewMode === "categories" && (
        <CategoriesView
          categoriesToDisplay={categoriesToDisplay}
          groupedRecipes={groupedRecipes}
          setSelectedCategory={setSelectedCategory}
          setViewMode={setViewMode}
          openEditCategoryModal={openEditCategoryModal}
          openAddCategoryModal={openAddCategoryModal}
          getRecipeWord={getRecipeWord}
        />
      )}

      {/* SINGLE CATEGORY */}
      {viewMode === "category" && (
        <CategoryView
          selectedCategory={selectedCategory}
          groupedRecipes={groupedRecipes}
          listRef={listRef}
          setViewMode={setViewMode}
          setSelectedCategory={setSelectedCategory}
          expandedRecipeId={expandedRecipeId}
          editingRecipeId={editingRecipeId}
          user={user}
          onToggle={toggleRecipe}
          onEdit={setEditingRecipeId}
          onDelete={handleRecipeDelete}
          onSubmit={handleRecipeSubmit}
          onCancel={() => setEditingRecipeId(null)}
        />
      )}

      {/* ALL RECIPES */}
      {viewMode === "all" && (
        <RecipesListView
          groupedRecipes={groupedRecipes}
          listRef={listRef}
          setViewMode={setViewMode}
          expandedRecipeId={expandedRecipeId}
          editingRecipeId={editingRecipeId}
          user={user}
          onToggle={toggleRecipe}
          onEdit={setEditingRecipeId}
          onDelete={handleRecipeDelete}
          onSubmit={handleRecipeSubmit}
          onCancel={() => setEditingRecipeId(null)}
        />
      )}

      <CategoryModal
        open={isCategoryModalOpen}
        category={categoryToEdit}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setCategoryToEdit(null);
        }}
      />
    </div>
  );
};

export default Recipes;