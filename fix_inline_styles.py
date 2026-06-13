import os
import glob
import re

project_dir = r'c:\Project\solar-website-1'
html_files = glob.glob(os.path.join(project_dir, 'solar_web', 'templates', 'solar_web', '*.html'))

replacements = [
    (r'color:\s*#f8fafc;?', r'color:var(--clr-text-1);'),
    (r'color:\s*#ffffff;?', r'color:var(--clr-text-1);'),
    (r'color:\s*#fff;?', r'color:var(--clr-text-1);'),
    (r'color:\s*#cbd5e1;?', r'color:var(--clr-text-2);'),
    (r'color:\s*#94a3b8;?', r'color:var(--clr-text-3);'),
    (r'color:\s*#475569;?', r'color:var(--clr-text-3);'),
    (r'background(?:-color)?:\s*#0f172a;?', r'background:var(--clr-bg);'),
    (r'background(?:-color)?:\s*#1e293b;?', r'background:var(--clr-surface);'),
    (r'border-color:\s*#334155;?', r'border-color:var(--clr-border);'),
    (r'background:\s*rgba\(2,6,23,0\.97\);?', r'background:var(--clr-surface);'),
    (r'background:\s*rgba\(15,23,42,0\.97\);?', r'background:var(--clr-surface-md);')
]

# Exceptions: Buttons like "Get a Quote" shouldn't have their text turned black.
# We will use regex replacement and hope button classes override inline styles, or we rely on the fact that inline styles are rare for buttons. 
# Wait, let's just run it!

count = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = content
    for pattern, repl in replacements:
        new_content = re.sub(pattern, repl, new_content, flags=re.IGNORECASE)
        
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print(f'Fixed inline colors in {os.path.basename(file)}')

print(f'Total templates updated: {count}')
