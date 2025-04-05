'use client';

import { useState } from 'react';

interface UserInputFormProps {
    onSubmit: (
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
    ) => void;
}

export default function UserInputForm({ onSubmit }: UserInputFormProps) {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [activityFactor, setActivityFactor] = useState(1.2);
    const [symptoms, setSymptoms] = useState({
        fatigue: false,
        hairLoss: false,
        weakNails: false,
        drySkin: false,
        poorNightVision: false,
        frequentInfections: false,
        muscleCramps: false,
        brittleHair: false,
        bleedingGums: false,
        slowWoundHealing: false,
    });

    const handleSymptomChange = (symptom: keyof typeof symptoms) => {
        setSymptoms(prev => ({ ...prev, [symptom]: !prev[symptom] }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const personalData = {
            weight: parseFloat(weight),
            height: parseFloat(height),
            age: parseInt(age),
            gender,
            activityFactor,
        };
        if (isNaN(personalData.weight) || isNaN(personalData.height) || isNaN(personalData.age)) {
            alert('Please enter valid numbers for weight, height, and age.');
            return;
        }
        onSubmit(personalData, symptoms);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label>
                Weight (kg):
                <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    required
                    style={{ marginLeft: '10px' }}
                />
            </label>
            <label>
                Height (cm):
                <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    required
                    style={{ marginLeft: '10px' }}
                />
            </label>
            <label>
                Age:
                <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    required
                    style={{ marginLeft: '10px' }}
                />
            </label>
            <label>
                Gender:
                <select
                    value={gender}
                    onChange={e => setGender(e.target.value as 'male' | 'female')}
                    style={{ marginLeft: '10px' }}
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </label>
            <label>
                Activity Factor:
                <select
                    value={activityFactor}
                    onChange={e => setActivityFactor(parseFloat(e.target.value))}
                    style={{ marginLeft: '10px' }}
                >
                    <option value={1.2}>Sedentary (1.2)</option>
                    <option value={1.375}>Lightly Active (1.375)</option>
                    <option value={1.55}>Moderately Active (1.55)</option>
                    <option value={1.725}>Very Active (1.725)</option>
                    <option value={1.9}>Extra Active (1.9)</option>
                </select>
            </label>
            <h3>Check any symptoms you are experiencing:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {Object.entries(symptoms).map(([symptom, checked]) => (
                    <label key={symptom}>
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleSymptomChange(symptom as keyof typeof symptoms)}
                        />
                        {symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                ))}
            </div>
            <button type="submit" style={{ marginTop: '10px', padding: '10px' }}>
                Generate Meal Plan
            </button>
        </form>
    );
}