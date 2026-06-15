export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       'var(--bg)',
        card:     'var(--bg-card)',
        field:    'var(--bg-field)',
        border:   'var(--border)',
        'border-dark': 'var(--border-dark)',
        primary:  'var(--text-primary)',
        secondary:'var(--text-secondary)',
        muted:    'var(--text-muted)',
        accent:   'var(--accent)',
        gold:     'var(--accent-gold)',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        body:    ['system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '10px',
        'xs':  '11px',
        'sm':  '12px',
        'base':'14px',
        'lg':  '16px',
        'xl':  '20px',
        '2xl': '28px',
        '3xl': '40px',
        '4xl': '64px',
      },
    },
  },
};