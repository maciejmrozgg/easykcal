import { useState, useEffect } from "react";
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "./api/recipesRoutes";
import RecipeForm from "./RecipeForm";
import './Recipes.css';

const Recipes = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  return (
    <div className="component">
      <h2>Przepisy</h2>

      {/* Przycisk Dodaj przepis */}
      {!showAddForm && (
        <button onClick={() => setShowAddForm(true)}>Dodaj przepis</button>
      )}

      {/* Formularz dodawania przepisu */}
      {showAddForm && (
        <RecipeForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {recipes.length === 0 && <p>Brak przepisów do wyświetlenia.</p>}

      {recipes.map((r) => (
        <div key={r.id} className="recipe-card">
          <h3>{r.title}</h3>
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
          {user?.role === 'admin' && (
            <button
              className="delbtn"
              onClick={() => handleDelete(r.id)}
            >
              🗑️ Usuń
            </button>
          )}

          {/* Formularz edycji pod przepisem */}
          {editingRecipeId === r.id && (
            <RecipeForm
              initialData={r}
              onSubmit={handleFormSubmit}
              onCancel={() => setEditingRecipeId(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Recipes;