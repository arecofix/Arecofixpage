import re

with open('src/app/public/portfolio/portfolio.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # Backgrounds with optional opacity
    (r'bg-\[\#131620\](/(\d+))?', r'bg-white dark:bg-[#131620]\1'),
    (r'bg-\[\#0d1017\](/(\d+))?', r'bg-slate-50 dark:bg-[#0d1017]\1'),
    (r'bg-\[\#1a1d2d\](/(\d+))?', r'bg-slate-100 dark:bg-[#1a1d2d]\1'),
    (r'bg-\[\#0e111a\](/(\d+))?', r'bg-white dark:bg-[#0e111a]\1'),
    (r'bg-\[\#0f111a\](/(\d+))?', r'bg-white dark:bg-[#0f111a]\1'),
    
    (r'bg-gray-800(/(\d+))?', r'bg-slate-200 dark:bg-gray-800\1'),
    (r'bg-gray-900(/(\d+))?', r'bg-slate-100 dark:bg-gray-900\1'),

    (r'hover:bg-\[\#181c2b\](/(\d+))?', r'hover:bg-slate-50 dark:hover:bg-[#181c2b]\1'),
    (r'hover:bg-gray-800(/(\d+))?', r'hover:bg-slate-200 dark:hover:bg-gray-800\1'),
    (r'hover:bg-gray-700(/(\d+))?', r'hover:bg-slate-300 dark:hover:bg-gray-700\1'),
    
    # Borders with optional opacity
    (r'border-gray-800(/(\d+))?', r'border-slate-200 dark:border-gray-800\1'),
    (r'border-gray-700(/(\d+))?', r'border-slate-300 dark:border-gray-700\1'),
]

for pattern, repl in replacements:
    content = re.sub(pattern, repl, content)

# Fix duplicate classes if the first script matched partially.
# E.g., if it already became 'bg-white dark:bg-[#131620]', and we run again, it might become 'bg-white dark:bg-white dark:bg-[#131620]'.
# To prevent this, let's just do a clean read of git checkout (since we might have messed up).
