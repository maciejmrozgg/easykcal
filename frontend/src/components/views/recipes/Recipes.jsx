import { useState, useEffect, useRef } from "react";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "./api/recipesApi";
import { getCategories, createCategory, updateCategory, deleteCategory } from "./api/categoriesApi";

import RecipeForm from "./RecipeForm";
import CategoryModal from "./components/modals/CategoryModal";
import RecipeCard from "./components/RecipeCard";
import RecipesToolbar from "./components/RecipesToolbar";

import "./styles/Recipes.css";

const Recipes = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [viewMode, setViewMode] = useState("categories"); // "categories" | "category" | "all"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const listRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch recipes on component mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        console.error("Błąd pobierania przepisów:", err);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

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
        await updateRecipe(editingRecipeId, recipeData);
        setEditingRecipeId(null);
      } else {
        await createRecipe(recipeData);
        setShowAddForm(false);
      }

      const refreshed = await getRecipes();
      setRecipes(refreshed);

    } catch (err) {
      console.error("Błąd zapisu przepisu:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć przepis?")) {
      await deleteRecipe(id);
      setRecipes(recipes.filter(r => r.id !== id));
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(filter.toLowerCase())
  );

  const groupedRecipes = filteredRecipes.reduce((acc, recipe) => {
    const category = recipe.category_name || "Bez kategorii";
    if (!acc[category]) acc[category] = [];
    acc[category].push(recipe);
    return acc;
  }, {});

  // Add virtual "Bez kategorii" tile if needed
  const categoriesWithFallback = [
    ...categories,
    ...(groupedRecipes["Bez kategorii"]
      ? [{ id: "no-category", name: "Bez kategorii", image_url: null }]
      : [])
  ];

  const categoryList = Object.keys(groupedRecipes);

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
        const updated = await updateCategory(categoryToEdit.id, name);

        setCategories(prev =>
          prev.map(c => c.id === categoryToEdit.id ? updated : c)
        );
      } else {
        const created = await createCategory(name);
        setCategories(prev => [...prev, created]);
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
      await deleteCategory(categoryToEdit.id);
      setCategories(prev =>
        prev.filter(c => c.id !== categoryToEdit.id)
      );

      const refreshedRecipes = await getRecipes();
      setRecipes(refreshedRecipes);

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

      {/* CATEGORY GRID */}
      {viewMode === "categories" && (
        <>
          <div className="categories-grid fade-in">
            {categoriesWithFallback.map((cat) => {
              const count = groupedRecipes[cat.name]?.length || 0;

              return (
                <div key={cat.id} className="category-tile">
                  <div
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setViewMode("category");
                    }}
                  >
                    <img
                      src={cat.image_url || "/images/categories/default.jpg"}
                      alt={cat.name}
                      className="category-image"
                    />

                    <h3>{cat.name}</h3>
                    <span>{count} {getRecipeWord(count)}</span>
                  </div>

                  {/* CUSTOM CATEGORIES OPEN MODAL */}
                  {cat.user_id && (
                    <div style={{ marginTop: "0.7rem" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditCategoryModal(cat);
                        }}
                        style={{ marginRight: "0.5rem" }}
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* ADD CUSTOM CATEGORY TILE*/}
            <div
              className="category-tile add-category-tile"
              onClick={openAddCategoryModal}
            >
              <div className="add-category-plus">+</div>
              <h3>Dodaj kategorię</h3>
            </div>
          </div>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <button
              className="back-to-categories-btn"
              onClick={() => setViewMode("all")}
            >
              Pokaż wszystkie przepisy
            </button>
          </div>
        </>
      )}

      {/* SINGLE CATEGORY */}
      {viewMode === "category" && (
        <div className="fade-in">
          <button
            className="back-to-categories-btn"
            onClick={() => {
              setViewMode("categories");
              setSelectedCategory(null);
            }}
          >
            ← Wszystkie kategorie
          </button>

          <div ref={listRef} className="recipes-scroll-container">
            {groupedRecipes[selectedCategory]?.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                isExpanded={expandedRecipeId === r.id}
                isEditing={editingRecipeId === r.id}
                user={user}
                onToggle={toggleRecipe}
                onEdit={setEditingRecipeId}
                onDelete={handleDelete}
                onSubmit={handleFormSubmit}
                onCancel={() => setEditingRecipeId(null)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ALL RECIPES */}
      {viewMode === "all" && (
        <div className="fade-in">
          <button
            className="back-to-categories-btn"
            onClick={() => setViewMode("categories")}
          >
            ← Wszystkie kategorie
          </button>

          <div ref={listRef} className="recipes-scroll-container">
            {Object.entries(groupedRecipes).map(([category, recipesInCategory]) => (
              <div key={category} className="recipe-category-section">
                <h2 className="category-header">{category}</h2>
                {recipesInCategory.map((r) => (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    isExpanded={expandedRecipeId === r.id}
                    isEditing={editingRecipeId === r.id}
                    user={user}
                    onToggle={toggleRecipe}
                    onEdit={setEditingRecipeId}
                    onDelete={handleDelete}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setEditingRecipeId(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
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