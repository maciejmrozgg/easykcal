import { useState, useEffect, useRef } from "react";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "./api/recipesApi";
import { getCategories } from "./api/categoriesApi";
import RecipeForm from "./RecipeForm";
import ScrollButtons from "../../products/components/ScrollButtons";
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
    if (editingRecipeId) {
      await updateRecipe(editingRecipeId, recipeData);
      const refreshed = await getRecipes();
      setRecipes(refreshed);
      setEditingRecipeId(null);
    } else {
      const newRecipe = await createRecipe(recipeData);
      setRecipes([...recipes, newRecipe]);
      setShowAddForm(false);
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

  const renderRecipeCard = (r) => {
    const isExpanded = expandedRecipeId === r.id;

    return (
      <div key={r.id} className="recipe-card">
        <h3
          className="recipe-title"
          onClick={() => toggleRecipe(r.id)}
        >
          {r.title} <span>{isExpanded ? "▲" : "▼"}</span>
        </h3>

        <div className={`recipe-details ${isExpanded ? "open" : ""}`}>
          {r.description && <p>{r.description}</p>}

          {r.ingredients?.length > 0 && (
            <>
              <strong>Składniki:</strong>
              <ul>
                {r.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </>
          )}

          {r.instructions?.length > 0 && (
            <>
              <strong>Instrukcje:</strong>
              <ol>
                {r.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </>
          )}

          {user &&
            (user.id === r.user_id || user.role === "admin") && (
              <button
                className="edit-recipe-btn"
                onClick={() => setEditingRecipeId(r.id)}
              >
                ✏️ Edytuj
              </button>
            )}

          {user?.role === "admin" && (
            <button
              className="del-recipe-btn"
              onClick={() => handleDelete(r.id)}
            >
              🗑️ Usuń
            </button>
          )}

          {editingRecipeId === r.id && (
            <RecipeForm
              initialData={r}
              onSubmit={handleFormSubmit}
              onCancel={() => setEditingRecipeId(null)}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="component">
      <h2>Przepisy</h2>

      {/* TOOLBAR */}
      <div className="recipes-toolbar">
        <div className="recipe-search" ref={searchRef}>
          <input
            className="recipe-filter"
            type="text"
            placeholder="Wyszukaj przepis po nazwie..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setShowSuggestions(true);
            }}
          />

          {/* SUGESTIONS */}
          {showSuggestions && filter && filteredRecipes.length > 0 && (
            <ul className="recipe-suggestions">
              {filteredRecipes.slice(0, 5).map((r) => (
                <li
                  key={r.id}
                  onClick={() => {
                    setFilter(r.title);
                    setShowSuggestions(false);
                    setViewMode("all");
                  }}
                >
                  {r.title}
                </li>
              ))}
            </ul>
          )}

          {filter && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setFilter("");
                setShowSuggestions(false);
              }}
            >
              ✕ Wyczyść
            </button>
          )}
        </div>

        {!showAddForm && (
          <button
            className="add-recipe-btn"
            onClick={() => setShowAddForm(true)}
          >
            Dodaj przepis
          </button>
        )}

        {viewMode !== "categories" && (
          <ScrollButtons
            scrollToTop={scrollToTop}
            scrollToBottom={scrollToBottom}
          />
        )}
      </div>

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
                <div
                  key={cat.id}
                  className="category-tile"
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
              );
            })}
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
            {groupedRecipes[selectedCategory]?.map(renderRecipeCard)}
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
                {recipesInCategory.map(renderRecipeCard)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;