/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: '#1A2526',
                coral: '#FF5733',
                lightGray: '#F5F5F5',
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'], // You can use Poppins or another sans-serif font
            },
        },
    },
    plugins: [],
};