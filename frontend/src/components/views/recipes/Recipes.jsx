import { useState, useEffect } from "react";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "./api/recipesApi";
import RecipeForm from "./RecipeForm";
import "./Recipes.css";

const Recipes = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState("");

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

  const toggleRecipe = (id) => {
    setExpandedRecipeId(prev => (prev === id ? null : id));
    setEditingRecipeId(null);
  };

  const handleFormSubmit = async (recipeData) => {
    if (editingRecipeId) {
      const updated = await updateRecipe(editingRecipeId, recipeData);
      setRecipes(recipes.map(r => r.id === editingRecipeId ? updated : r));
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

  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="component">
      <h2>Przepisy</h2>

      {/* Filtrowanie */}
      <input
        className="recipe-filter"
        type="text"
        placeholder="Szukaj przepisu po nazwie..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {!showAddForm && (
        <button onClick={() => setShowAddForm(true)}>Dodaj przepis</button>
      )}

      {showAddForm && (
        <RecipeForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {filteredRecipes.length === 0 && <p>Brak przepisów.</p>}

      {filteredRecipes.map((r) => {
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

              {r.ingredients.length > 0 && (
                <>
                  <strong>Składniki:</strong>
                  <ul>
                    {r.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </>
              )}

              {r.instructions.length > 0 && (
                <>
                  <strong>Instrukcje:</strong>
                  <ol>
                    {r.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </>
              )}

              {user && (user.id === r.user_id || user.role === "admin") && (
                <button
                  className="editbtn"
                  onClick={() => setEditingRecipeId(r.id)}
                >
                  ✏️ Edytuj
                </button>
              )}

              {user?.role === "admin" && (
                <button
                  className="delbtn"
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
      })}
    </div>
  );
};

export default Recipes;