interface Ingredient {
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
}

interface Nutrient {
    name: string;
    amount: number;
    unit: string;
    percentOfDailyNeeds: number;
}

interface InstructionStep {
    number: number;
    step: string;
    ingredients: { id: number; name: string }[];
    equipment: { id: number; name: string }[];
}

interface Instruction {
    name: string;
    steps: InstructionStep[];
}

interface Recipe {
    id: number;
    title: string;
    image: string;
    servings: number;
    readyInMinutes: number;
    summary: string;
    extendedIngredients: Ingredient[];
    nutrition: {
        nutrients: Nutrient[];
    };
    analyzedInstructions: Instruction[];
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    veryHealthy: boolean;
    healthScore: number;
    spoonacularScore: number;
}

export async function fetchRecipeData(id: number): Promise<Recipe> {
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    if (!apiKey) {
        throw new Error('NEXT_PUBLIC_SPOONACULAR_API_KEY is not set in environment variables');
    }

    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=true`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Recipe not found');
        }
        throw new Error(`Failed to fetch recipe: ${response.status} ${response.statusText}`);
    }

    const data: Recipe = await response.json();
    return data;
}