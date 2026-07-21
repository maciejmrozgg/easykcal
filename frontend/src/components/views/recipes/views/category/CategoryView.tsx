import RecipeCard from "../../components/RecipeCard";
import type { Category } from "../../../../../types/category"; 
import type { Recipe } from "../../../../../types/recipe"; 
import type { User } from "../../../../../types/user";
import type { ViewMode } from "../../../../../types/ui"; 

type CategoryViewProps = {
    selectedCategory: Category | null;

    groupedRecipes: Record<string, Recipe[]>;

    listRef: React.RefObject<HTMLDivElement>;

    setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<Category| null>>;

    expandedRecipeId: number | null;
    editingRecipeId: number | null;

    user: User;

    onToggle: (id: number) => void;
    onEdit: React.Dispatch<React.SetStateAction<number | null>>;
    onDelete: (recipe: Recipe) => Promise<void>;

    onSubmit: (recipe: Recipe) => Promise<void>;
    onCancel: () => void;
};

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
}: CategoryViewProps) => {

    const categoryName = selectedCategory?.name;

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

            <div ref={listRef} className="recipes-scroll-container custom-scrollbar">
                {categoryName && groupedRecipes[categoryName]?.map((r) => (
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