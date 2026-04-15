import RecipeCard from "../../components/RecipeCard";

const RecipesListView = ({
    groupedRecipes,
    listRef,
    setViewMode,
    expandedRecipeId,
    editingRecipeId,
    user,
    onToggle,
    onEdit,
    onDelete,
    onSubmit,
    onCancel,
}) => {
    return (
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
                                onToggle={onToggle}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onSubmit={onSubmit}
                                onCancel={onCancel}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipesListView;