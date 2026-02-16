import { useState, useEffect, useRef } from "react";
import { getCategories } from "./api/categoriesApi";
import './styles/RecipeForm.css';

const RecipeForm = ({ initialData = {}, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [ingredients, setIngredients] = useState(initialData?.ingredients?.length ? initialData.ingredients : [""]);
    const [instructions, setInstructions] = useState(initialData?.instructions?.length ? initialData.instructions : [""]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(initialData?.category_id || "");

    const formRef = useRef();

    // Scroll to form if editing
    useEffect(() => {
        formRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
    }, []);

    // Fetch category
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };

        fetchCategories();
    }, []);

    const handleIngredientChange = (index, value) => {
        const updated = [...ingredients];
        updated[index] = value;
        setIngredients(updated);
    };

    const handleInstructionChange = (index, value) => {
        const updated = [...instructions];
        updated[index] = value;
        setInstructions(updated);
    };

    const addIngredient = () => setIngredients([...ingredients, ""]);
    const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));

    const addInstruction = () => setInstructions([...instructions, ""]);
    const removeInstruction = (index) => setInstructions(instructions.filter((_, i) => i !== index));

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) return alert("Tytuł jest wymagany");
        if (!ingredients.some(i => i.trim())) return alert("Dodaj przynajmniej jeden składnik");
        if (!instructions.some(i => i.trim())) return alert("Dodaj przynajmniej jedną instrukcję");

        const recipeData = {
            title,
            description,
            ingredients: ingredients.filter(i => i.trim()),
            instructions: instructions.filter(i => i.trim()),
            category_id: categoryId || null
        };

        onSubmit(recipeData);
    };

    return (
        <div ref={formRef} className="recipe-form">
            <h3>{initialData?.id ? "Edytuj przepis" : "Dodaj nowy przepis"}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Tytuł"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Opis"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select
                    className="category-select"
                    value={categoryId}
                    onChange={(e) =>
                        setCategoryId(e.target.value ? Number(e.target.value) : "")}
                >
                    <option value="">-- Wybierz kategorię --</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <div className="list-container">
                    <strong>Składniki:</strong>
                    {ingredients.map((ing, i) => (
                        <div key={i} className="ingredient">
                            <input
                                type="text"
                                value={ing}
                                onChange={(e) => handleIngredientChange(i, e.target.value)}
                            />
                            <button type="button" className="remove-ingredient-btn" onClick={() => removeIngredient(i)}>Usuń</button>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={addIngredient}>Dodaj składnik</button>
                </div>

                <div className="list-container">
                    <strong>Instrukcje:</strong>
                    {instructions.map((inst, i) => (
                        <div key={i} className="instruction">
                            <input
                                type="text"
                                value={inst}
                                onChange={(e) => handleInstructionChange(i, e.target.value)}
                            />
                            <button type="button" className="remove-instruction-btn" onClick={() => removeInstruction(i)}>Usuń</button>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={addInstruction}>Dodaj instrukcję</button>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" data-testid="submit-recipe">{initialData?.id ? "Zapisz zmiany" : "Dodaj przepis"}</button>
                    <button type="button" className="cancel-btn" onClick={onCancel}>Anuluj</button>
                </div>
            </form>
        </div>
    );
};

export default RecipeForm;