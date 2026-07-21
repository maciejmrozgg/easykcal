import RecipeCard from "../../components/RecipeCard";
import type { Recipe } from "../../../../../types/recipe";
import type { ViewMode } from "../../../../../types/ui";
import type { User } from "../../../../../types/user";

type RecipesListViewProps = {
    groupedRecipes: Record<string, Recipe[]>;

    listRef: React.RefObject<HTMLDivElement>;
    setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;

    expandedRecipeId: number | null;
    editingRecipeId: number | null;

    user: User;

    onToggle: (id: number) => void;
    onEdit: React.Dispatch<React.SetStateAction<number | null>>;
    onDelete: (recipe: Recipe) => Promise<void>;

    onSubmit: (recipeData: Recipe) => Promise<void>;
    onCancel: () => void;
};

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
}: RecipesListViewProps) => {
    return (
        <div className="fade-in">
            <button
                className="back-to-categories-btn"
                onClick={() => setViewMode("categories")}
            >
                ← Wszystkie kategorie
            </button>

            <div ref={listRef} className="recipes-scroll-container custom-scrollbar">
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