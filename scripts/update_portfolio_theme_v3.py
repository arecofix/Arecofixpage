import re

with open('src/app/public/portfolio/portfolio.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # Backgrounds with optional opacity
    (r'bg-\[\#131620\](/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'bg-white dark:bg-[#131620]\1'),
    (r'bg-\[\#0d1017\](/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'bg-slate-50 dark:bg-[#0d1017]\1'),
    (r'bg-\[\#1a1d2d\](/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'bg-slate-100 dark:bg-[#1a1d2d]\1'),
    (r'bg-\[\#0e111a\](/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'bg-white dark:bg-[#0e111a]\1'),
    (r'bg-\[\#0f111a\](/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'bg-white dark:bg-[#0f111a]\1'),
    
    (r'\bbg-surface-dark\b', 'bg-slate-50 dark:bg-surface-dark'),
    (r'\bbg-gray-800(/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'bg-slate-200 dark:bg-gray-800\1'),
    (r'\bbg-gray-900(/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'bg-slate-100 dark:bg-gray-900\1'),

    (r'\bhover:bg-\[\#181c2b\](/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'hover:bg-slate-50 dark:hover:bg-[#181c2b]\1'),
    (r'\bhover:bg-gray-800(/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'hover:bg-slate-200 dark:hover:bg-gray-800\1'),
    (r'\bhover:bg-gray-700(/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'hover:bg-slate-300 dark:hover:bg-gray-700\1'),
    
    # Texts
    (r'\btext-white\b', 'text-slate-900 dark:text-white'),
    (r'\btext-gray-100\b', 'text-slate-800 dark:text-gray-100'),
    (r'\btext-gray-300\b', 'text-slate-700 dark:text-gray-300'),
    (r'\btext-gray-400\b', 'text-slate-600 dark:text-gray-400'),
    (r'\btext-gray-500\b', 'text-slate-500 dark:text-gray-500'),
    (r'\btext-gray-600\b', 'text-slate-400 dark:text-gray-600'),
    (r'\bhover:text-white\b', 'hover:text-slate-900 dark:hover:text-white'),
    
    # Borders with optional opacity
    (r'\bborder-gray-800(/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'border-slate-200 dark:border-gray-800\1'),
    (r'\bborder-gray-700(/(0|[1-9][0-9]?|100|\.[0-9]+))?', r'border-slate-300 dark:border-gray-700\1'),
]

for pattern, repl in replacements:
    content = re.sub(pattern, repl, content)

# Specific fixes for aesthetics
# Grid Background Effect (lines 5-6)
content = content.replace('linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)')
content = content.replace('class="fixed inset-0 z-0 pointer-events-none opacity-20"', 'class="fixed inset-0 z-0 pointer-events-none opacity-10 dark:opacity-20 text-slate-300 dark:text-[#1f2937]"')

# Fix Code snippet background specifically so it looks like a terminal in both themes
content = content.replace('<code class="language-typescript text-slate-700 dark:text-gray-300">', '<code class="language-typescript text-slate-800 dark:text-gray-300">')

with open('src/app/public/portfolio/portfolio.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex replacements done")
