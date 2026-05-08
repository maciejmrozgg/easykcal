export type Recipe = {
    id: number;
    
    user_id: number;

    title: string;
    description?: string;

    ingredients: string[];
    instructions: string[];

    image_name: string | null;

    category_id?: number | null;
    category_name?: string;
};