// tailwind.config.js (Make sure this is up-to-date)
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-olive': '#637C70', // The green shade from the large image banner's tint
        'brand-green-button': '#66A59A', // The slightly brighter green of the "Get started" button in the banner

        'text-heading': '#2C3E50', // Dark almost black for headings
        'text-body': '#5A6A7A',    // Dark grey for body text

        'background-light': '#F8F9FA', // The very light off-white background
        'card-background': '#FFFFFF',  // White for cards
        'border-light': '#E0E6ED',     // Light grey for borders on cards

        'nav-blue': '#4A87D0', // The blue "Get Started" button in the top navigation
        'nav-link': '#5A6A7A', // Grey for nav links

        'cozo-green': '#5a6f3b',          // The dark muted olive green from the Cozo logo
        'cozo-light-beige': '#ecebe1',    // The light background from the Cozo logo image
        'taskmaster-blue': '#3b82f6',     // Original  blue (if still needed elsewhere)
        'cozo-dark-green': '#3d4b28',     // A darker shade of Cozo green, suitable for buttons
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
    },
  },
  plugins: [],
}