import RecipeForm from "../RecipeForm";

const RecipeCard = ({
  recipe,
  isExpanded,
  isEditing,
  user,
  onToggle,
  onEdit,
  onDelete,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="recipe-card">
      <h3
        className="recipe-title"
        onClick={() => onToggle(recipe.id)}
      >
        {recipe.title} <span>{isExpanded ? "▲" : "▼"}</span>
      </h3>

      <div className={`recipe-details ${isExpanded ? "open" : ""}`}>
        {recipe.description && <p>{recipe.description}</p>}

        {recipe.ingredients?.length > 0 && (
          <>
            <strong>Składniki:</strong>
            <ul>
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </>
        )}

        {recipe.instructions?.length > 0 && (
          <>
            <strong>Instrukcje:</strong>
            <ol>
              {recipe.instructions.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ol>
          </>
        )}

        {user &&
          (user.id === recipe.user_id || user.role === "admin") && (
            <button
              className="edit-recipe-btn"
              onClick={() => onEdit(recipe.id)}
            >
              ✏️ Edytuj
            </button>
          )}

        {user?.role === "admin" && (
          <button
            className="del-recipe-btn"
            onClick={() => onDelete(recipe.id)}
          >
            🗑️ Usuń
          </button>
        )}

        {isEditing && (
          <RecipeForm
            initialData={recipe}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        )}
      </div>
    </div>
  );
};

export default RecipeCard;