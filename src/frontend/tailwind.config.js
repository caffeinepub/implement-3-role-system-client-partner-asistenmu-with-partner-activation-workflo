import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                teal: {
                    50: 'oklch(0.97 0.02 190)',
                    100: 'oklch(0.93 0.04 190)',
                    200: 'oklch(0.85 0.08 190)',
                    300: 'oklch(0.75 0.10 190)',
                    400: 'oklch(0.65 0.12 190)',
                    500: 'oklch(0.55 0.12 190)',
                    600: 'oklch(0.48 0.12 190)',
                    700: 'oklch(0.40 0.11 190)',
                    800: 'oklch(0.32 0.09 190)',
                    900: 'oklch(0.25 0.07 190)',
                },
                gray: {
                    50: 'oklch(0.98 0.002 220)',
                    100: 'oklch(0.96 0.003 220)',
                    200: 'oklch(0.92 0.005 220)',
                    300: 'oklch(0.85 0.007 220)',
                    400: 'oklch(0.70 0.010 220)',
                    500: 'oklch(0.55 0.012 220)',
                    600: 'oklch(0.45 0.012 220)',
                    700: 'oklch(0.35 0.012 220)',
                    800: 'oklch(0.28 0.012 220)',
                    900: 'oklch(0.20 0.012 220)',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: 'calc(var(--radius) + 4px)',
                '2xl': 'calc(var(--radius) + 8px)',
                '3xl': 'calc(var(--radius) + 16px)',
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                sm: '0 2px 8px -2px rgba(13, 148, 136, 0.08)',
                DEFAULT: '0 4px 16px -4px rgba(13, 148, 136, 0.12)',
                md: '0 6px 24px -6px rgba(13, 148, 136, 0.15)',
                lg: '0 10px 40px -10px rgba(13, 148, 136, 0.18)',
                xl: '0 20px 60px -15px rgba(13, 148, 136, 0.22)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
