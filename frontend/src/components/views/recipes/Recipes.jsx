import { useState, useEffect } from "react";
import { getRecipes } from "./api/recipesRoutes";
import './Recipes.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

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

  return (
    <div className="component">
      <h2>Przepisy</h2>
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
        </div>
      ))}
    </div>
  );
};

export default Recipes;