const CategoriesView = ({
    categoriesToDisplay,
    groupedRecipes,
    setSelectedCategory,
    setViewMode,
    openEditCategoryModal,
    openAddCategoryModal,
    getRecipeWord,
}) => {
    return (
        <>
            {/* CATEGORIES GRID */}
            <div className="categories-grid fade-in">
                {categoriesToDisplay.map((cat) => {
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
    );
};

export default CategoriesView;