import { useState, useEffect, useRef } from "react";

import RecipeForm from "./RecipeForm";
import CategoryModal from "./components/modals/CategoryModal";
import RecipesToolbar from "./components/RecipesToolbar";
import CategoriesView from "./views/categories/CategoriesView";
import CategoryView from "./views/category/CategoryView";
import RecipesListView from "./views/list/RecipesListView";
import useRecipes from "../../../hooks/useRecipes";

import "./styles/Recipes.css";

const Recipes = ({ user }) => {
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

  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [viewMode, setViewMode] = useState("categories"); // "categories" | "category" | "all"
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const listRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
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

  const toggleRecipe = (id) => {
    setExpandedRecipeId(prev => (prev === id ? null : id));
    setEditingRecipeId(null);
  };

  const handleFormSubmit = async (recipeData) => {
    try {
      if (editingRecipeId) {
        await editRecipe(editingRecipeId, recipeData);
        setEditingRecipeId(null);
      } else {
        await addRecipe(recipeData);
        setShowAddForm(false);
      }

    } catch (err) {
      console.error("Błąd zapisu przepisu:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć przepis?")) {
      await removeRecipe(id);
    }
  };

  const getRecipeWord = (count) => {
    if (count === 1) return "przepis";
    if (count >= 2 && count <= 4) return "przepisy";
    return "przepisów";
  };

  const openAddCategoryModal = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat) => {
    setCategoryToEdit(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (name) => {
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
          onSubmit={handleFormSubmit}
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
          onDelete={handleDelete}
          onSubmit={handleFormSubmit}
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
          onDelete={handleDelete}
          onSubmit={handleFormSubmit}
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