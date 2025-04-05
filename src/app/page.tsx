'use client';

import { useState } from 'react';
import UserInputForm from '@/components/UserInputForm';
import MealPlanDisplay from '@/components/MealPlanDisplay';
import {calculateBMR, generateMealPlan, mapSymptomsToMicronutrients} from '../utils/calculations';

const FDA_MICRONUTRIENT_DAILY_VALUES: { [key: string]: number } = {
    iron: 18, // mg
    vitaminB12: 2.4, // µg
    biotin: 30, // µg
    zinc: 11, // mg
    vitaminA: 900, // µg
    omega3: 1600, // mg
    vitaminC: 90, // mg
    magnesium: 420, // mg
    potassium: 4700, // mg
};

export default function Home() {
    const [mealPlan, setMealPlan] = useState<{ breakfast: { id: number; title: string } | null; lunch: { id: number; title: string } | null; dinner: { id: number; title: string } | null }[] | null>(null);
    const [dailyNutrients, setDailyNutrients] = useState<{
        calories: number;
        targetMicronutrients: { name: string; amount: number }[];
        protein: number;
        carbs: number;
        fat: number;
    } | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (
        personalData: {
            weight: number;
            height: number;
            age: number;
            gender: 'male' | 'female';
            activityFactor: number;
        },
        symptoms: {
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
    ) => {
        // Step 1: Clear any existing data and set loading status
        setIsLoading(true);
        setMealPlan(null);

        try {
            // Step 2: Calculate daily calorie requirement (BMR * activity)
            const bmr = calculateBMR(personalData);
            const dailyCalories = bmr * personalData.activityFactor;

            // Step 3: Map symptoms to target micronutrients
            const symptomMicronutrients = mapSymptomsToMicronutrients(symptoms);

            // Update the nutrients state for immediate display
            setDailyNutrients({
                calories: dailyCalories,
                targetMicronutrients: symptomMicronutrients.map((nutrient) => ({
                    name: nutrient,
                    amount: FDA_MICRONUTRIENT_DAILY_VALUES[nutrient] || 0,
                })),
                protein: dailyCalories * 0.20 / 4,
                carbs: dailyCalories * 0.50 / 4,
                fat: dailyCalories * 0.30 / 9,
            });

            // Step 4: Generate a meal plan
            const generatedMealPlan = await generateMealPlan(dailyCalories, symptomMicronutrients);
            setMealPlan(generatedMealPlan as { breakfast: { id: number; title: string } | null; lunch: { id: number; title: string } | null; dinner: { id: number; title: string } | null }[]);
        } catch (error) {
            console.error('Error generating meal plan:', error);
        } finally {
            // Step 5: End loading status
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Meal Plan Generator</h1>
            <UserInputForm onSubmit={handleFormSubmit} />

            {dailyNutrients && (
                <div style={{ marginBottom: '20px' }}>
                    <h2>Daily Nutrient Requirements</h2>
                    <p>Calories: {dailyNutrients.calories.toFixed(0)}</p>

                    {/* Macronutrients */}
                    <h3>Macronutrients</h3>
                    <ul>
                        <li>Protein: {dailyNutrients.protein.toFixed(1)} g</li>
                        <li>Carbohydrates: {dailyNutrients.carbs.toFixed(1)} g</li>
                        <li>Fats: {dailyNutrients.fat.toFixed(1)} g</li>
                    </ul>

                    {/* Micronutrients */}
                    <h3>Micronutrients (FDA recommended)</h3>
                    <ul>
                        {dailyNutrients.targetMicronutrients.map((micronutrient) => (
                            <li key={micronutrient.name}>
                                {micronutrient.name}: {micronutrient.amount}{' '}
                                {micronutrient.amount > 0 ? (micronutrient.amount >= 1000 ? 'mg' : 'µg') : ''}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {mealPlan && <MealPlanDisplay mealPlan={mealPlan} />}
        </div>
    );
}