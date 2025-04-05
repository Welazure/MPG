import {notFound} from 'next/navigation';
import {fetchRecipeData} from '@/utils/fetchRecipeData';

// Adjust RecipePage function parameter types
export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10);
    if (isNaN(id)) {
        notFound();
    }

    let recipe;
    try {
        recipe = await fetchRecipeData(id);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        if (error instanceof Error && error.message === 'Recipe not found') {
            notFound();
        }
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold text-red-600">Error</h1>
                <p>Unable to load the recipe. Please try again later.</p>
            </div>
        );
    }

    return (
        <html>

        <body>
        <div className="container mx-auto p-4 max-w-4xl">
            {/* Header */}
            <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
            <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
            />

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <p><strong>Servings:</strong> {recipe.servings}</p>
                <p><strong>Ready in:</strong> {recipe.readyInMinutes} minutes</p>
                <p><strong>Health Score:</strong> {recipe.healthScore}/100</p>
                <p><strong>Spoonacular Score:</strong> {Math.round(recipe.spoonacularScore)}%</p>
            </div>

            {/* Dietary Info */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Dietary Information</h2>
                <ul className="list-disc list-inside">
                    <li>Vegetarian: {recipe.vegetarian ? 'Yes' : 'No'}</li>
                    <li>Vegan: {recipe.vegan ? 'Yes' : 'No'}</li>
                    <li>Gluten Free: {recipe.glutenFree ? 'Yes' : 'No'}</li>
                    <li>Dairy Free: {recipe.dairyFree ? 'Yes' : 'No'}</li>
                    <li>Very Healthy: {recipe.veryHealthy ? 'Yes' : 'No'}</li>
                </ul>
            </div>

            {/* Summary */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Summary</h2>
                <div dangerouslySetInnerHTML={{__html: recipe.summary}}/>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Ingredients</h2>
                <ul className="list-disc list-inside">
                    {recipe.extendedIngredients.map((ingredient) => (
                        <li key={ingredient.id}>
                            {ingredient.amount} {ingredient.unit} {ingredient.name} - {ingredient.original}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Instructions */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Instructions</h2>
                {recipe.analyzedInstructions.length > 0 ? (
                    recipe.analyzedInstructions.map((instruction, index) => (
                        <div key={index} className="mb-4">
                            {instruction.name && <h3 className="text-lg font-medium">{instruction.name}</h3>}
                            <ol className="list-decimal list-inside">
                                {instruction.steps.map((step) => (
                                    <li key={step.number} className="mb-2">
                                        {step.step}
                                        {step.ingredients.length > 0 && (
                                            <span className="text-sm text-gray-600">
                        {' '}
                                                (Ingredients: {step.ingredients.map((ing) => ing.name).join(', ')})
                      </span>
                                        )}
                                        {step.equipment.length > 0 && (
                                            <span className="text-sm text-gray-600">
                        {' '}
                                                (Equipment: {step.equipment.map((eq) => eq.name).join(', ')})
                      </span>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))
                ) : (
                    <p>No instructions available.</p>
                )}
            </div>

            {/* Nutrition */}
            <div>
                <h2 className="text-xl font-semibold">Nutrition</h2>
                <ul className="list-disc list-inside">
                    {recipe.nutrition.nutrients.map((nutrient) => (
                        <li key={nutrient.name}>
                            {nutrient.name}: {nutrient.amount} {nutrient.unit} (
                            {nutrient.percentOfDailyNeeds.toFixed(1)}% of daily needs)
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </body>
        </html>
    );
}