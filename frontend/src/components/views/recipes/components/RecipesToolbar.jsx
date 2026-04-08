import ScrollButtons from "../../../products/components/ScrollButtons";

const RecipesToolbar = ({
    filter,
    setFilter,
    showSuggestions,
    setShowSuggestions,
    filteredRecipes,
    setViewMode,
    showAddForm,
    setShowAddForm,
    viewMode,
    scrollToTop,
    scrollToBottom,
    searchRef,
}) => {
    return (
        <div className="recipes-toolbar" >
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

            {
                !showAddForm && (
                    <button
                        className="add-recipe-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        Dodaj przepis
                    </button>
                )
            }

            {
                viewMode !== "categories" && (
                    <ScrollButtons
                        scrollToTop={scrollToTop}
                        scrollToBottom={scrollToBottom}
                    />
                )
            }
        </div >
    );
};

export default RecipesToolbar;