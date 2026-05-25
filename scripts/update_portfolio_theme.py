import re

with open('src/app/public/portfolio/portfolio.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # Backgrounds
    (r'\bbg-surface-dark\b', 'bg-slate-50 dark:bg-surface-dark'),
    (r'\bbg-\[\#131620\]\b', 'bg-white dark:bg-[#131620]'),
    (r'\bbg-\[\#0d1017\]\b', 'bg-slate-100 dark:bg-[#0d1017]'),
    (r'\bbg-\[\#1a1d2d\]\b', 'bg-slate-100 dark:bg-[#1a1d2d]'),
    (r'\bbg-\[\#0e111a\]', 'bg-white dark:bg-[#0e111a]'),
    (r'\bbg-\[\#0f111a\]\b', 'bg-white dark:bg-[#0f111a]'),
    (r'\bbg-gray-800\b', 'bg-slate-200 dark:bg-gray-800'),
    (r'\bbg-gray-900\b', 'bg-slate-100 dark:bg-gray-900'),
    (r'\bhover:bg-\[\#181c2b\]\b', 'hover:bg-slate-50 dark:hover:bg-[#181c2b]'),
    (r'\bhover:bg-gray-800\b', 'hover:bg-slate-200 dark:hover:bg-gray-800'),
    (r'\bhover:bg-gray-700\b', 'hover:bg-slate-300 dark:hover:bg-gray-700'),
    
    # Texts
    (r'\btext-white\b', 'text-slate-900 dark:text-white'),
    (r'\btext-gray-100\b', 'text-slate-800 dark:text-gray-100'),
    (r'\btext-gray-300\b', 'text-slate-700 dark:text-gray-300'),
    (r'\btext-gray-400\b', 'text-slate-600 dark:text-gray-400'),
    (r'\btext-gray-500\b', 'text-slate-500 dark:text-gray-500'),
    (r'\btext-gray-600\b', 'text-slate-400 dark:text-gray-600'),
    (r'\bhover:text-white\b', 'hover:text-slate-900 dark:hover:text-white'),
    
    # Borders
    (r'\bborder-gray-800\b', 'border-slate-200 dark:border-gray-800'),
    (r'\bborder-gray-700\b', 'border-slate-300 dark:border-gray-700'),
    
    # Grid Background Effect
    (r'#1f2937', 'currentColor'), 
]

for pattern, repl in replacements:
    content = re.sub(pattern, repl, content)

# Fix background grid text color
content = content.replace('class="fixed inset-0 z-0 pointer-events-none opacity-20"', 'class="fixed inset-0 z-0 pointer-events-none opacity-10 dark:opacity-20 text-slate-300 dark:text-[#1f2937]"')

# Fix Code snippet background specifically so it looks like a terminal
content = content.replace('class="language-typescript text-slate-700 dark:text-gray-300"', 'class="language-typescript text-slate-800 dark:text-gray-300"')

with open('src/app/public/portfolio/portfolio.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
