export const getRecipeWord = (count: number) => {
    if (count === 1) return "przepis";
    if (count >= 2 && count <= 4) return "przepisy";
    return "przepisów";
};