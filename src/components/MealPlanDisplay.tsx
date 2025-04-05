'use client';


interface MealPlanDisplayProps {
    mealPlan: {
        breakfast: { id: number; title: string } | null;
        lunch: { id: number; title: string } | null;
        dinner: { id: number; title: string } | null;
    }[];
}
export interface Recipe {
    id: number;
    title: string;
}

export default function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {

    const handleNavigation = (id: number) => {
        window.open(`/recipes/${id}`, '_blank');
    };

    return (
        <div>
            <h2>Weekly Meal Plan</h2>
            {mealPlan.map((day, index) => (
                <div key={index}>
                    <h3>Day {index + 1}</h3>
                    <p>
                        Breakfast: {day.breakfast ? (
                        <button
                            onClick={() => day.breakfast && handleNavigation(day.breakfast.id)}
                            aria-label={`View recipe for ${day.breakfast?.title ?? 'No recipe'}`}
                        >
                            {day.breakfast.title}
                        </button>
                    ) : (
                        'No recipe found'
                    )}
                    </p>
                    <p>
                        Lunch: {day.lunch ? (
                        <button
                            onClick={() => day.lunch && handleNavigation(day.lunch.id)}
                            aria-label={`View recipe for ${day.lunch.title}`}
                        >
                            {day.lunch.title}
                        </button>
                    ) : (
                        'No recipe found'
                    )}
                    </p>
                    <p>
                        Dinner: {day.dinner ? (
                        <button
                            onClick={() => day.dinner && handleNavigation(day.dinner.id)}
                            aria-label={`View recipe for ${day.dinner?.title ?? 'No recipe'}`}
                        >
                            {day.dinner.title}
                        </button>
                    ) : (
                        'No recipe found'
                    )}
                    </p>
                </div>
            ))}
        </div>
    );
}