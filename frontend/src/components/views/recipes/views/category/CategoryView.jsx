import RecipeCard from "../../components/RecipeCard";

const CategoryView = ({
    selectedCategory,
    groupedRecipes,
    listRef,
    setViewMode,
    setSelectedCategory,
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
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryView;