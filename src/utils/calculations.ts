import axios from 'axios';
import {Recipe} from "@/components/MealPlanDisplay";

interface PersonalData {
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female';
    activityFactor: number;
}

interface DeficiencySymptoms {
    fatigue: boolean;
    hairLoss: boolean;
    weakNails: boolean;
    drySkin: boolean;
    poorNightVision: boolean;
    frequentInfections: boolean;
    muscleCramps: boolean;
    brittleHair: boolean;
    bleedingGums: boolean;
    slowWoundHealing: boolean;
}

export function calculateBMR(data: PersonalData): number {
    const { weight, height, age, gender } = data;
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
}

const symptomToMicronutrients: { [key: string]: string[] } = {
    fatigue: ['iron', 'vitaminB12'],
    hairLoss: ['biotin', 'zinc'],
    weakNails: ['zinc', 'iron'],
    drySkin: ['vitaminA', 'omega3'],
    poorNightVision: ['vitaminA'],
    frequentInfections: ['vitaminC', 'zinc'],
    muscleCramps: ['magnesium', 'potassium'],
    brittleHair: ['biotin'],
    bleedingGums: ['vitaminC'],
    slowWoundHealing: ['zinc', 'vitaminC'],
};

export function mapSymptomsToMicronutrients(symptoms: DeficiencySymptoms): string[] {
    const targets: string[] = [];
    for (const [symptom, micronutrients] of Object.entries(symptomToMicronutrients)) {
        if (symptoms[symptom as keyof DeficiencySymptoms]) {
            targets.push(...micronutrients);
        }
    }
    return [...new Set(targets)]; // Remove duplicates
}
type RecipeRequest = {
    apiKey: string | undefined,
    type: string,
    minCalories: number,
    maxCalories: number
    number: number,
    targetMicronutrients: string[]
    excludeIds: string,
    [key: string]: string | number | string[] | undefined,
};
async function fetchRecipesForMeal(
    mealType: string,
    minCalories: number,
    maxCalories: number,
    targetMicronutrients: string[],
    excludeIds: number[] = [] // To avoid duplicates
) {
    const params: RecipeRequest = {
        apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
        type: mealType === 'breakfast' ? 'breakfast' : 'main course', // Use 'main course' for lunch/dinner
        minCalories,
        maxCalories,
        number: 7,
        excludeIds: excludeIds.join(','), // Exclude previously used recipe IDs
        targetMicronutrients: []
    };

    // Adjust calorie ranges for variety
    if (mealType === 'lunch') {
        params.maxCalories = maxCalories * 0.9; // Slightly lower for lunch
    } else if (mealType === 'dinner') {
        params.minCalories = minCalories * 1.1; // Slightly higher for dinner
    }

    targetMicronutrients.forEach(nutrient => {
        const key = `min${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}`;
        params[key] = 1;
    });

    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', { params });
        return response.data.results || [];
    } catch (error) {
        console.error(`Error fetching ${mealType} recipes:`, error);
        return [];
    }
}

export async function generateMealPlan(dailyCalories: number, targetMicronutrients: string[]) {
    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    const recipesByMeal: { [key: string]: Recipe[] } = {};
    let usedRecipeIds: number[] = [];

    for (const mealType of mealTypes) {
        const minCalories = 0.3 * dailyCalories * 0.9;
        const maxCalories = 0.3 * dailyCalories * 1.1;
        recipesByMeal[mealType] = await fetchRecipesForMeal(
            mealType,
            minCalories,
            maxCalories,
            targetMicronutrients,
            usedRecipeIds
        );
        usedRecipeIds = usedRecipeIds.concat(recipesByMeal[mealType].map(r => r.id));
    }

    const mealPlan = [];
    for (let day = 0; day < 7; day++) {
        const dayPlan: { [key: string]: Recipe | null } = {};
        for (const mealType of mealTypes) {
            const recipes = recipesByMeal[mealType];
            dayPlan[mealType] = recipes.length > 0 ? recipes[day % recipes.length] : null;
        }
        mealPlan.push(dayPlan);
    }
    return mealPlan;
}