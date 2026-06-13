import os
import re
import glob

project_dir = r'c:\Project\solar-website-1'
html_files = glob.glob(os.path.join(project_dir, 'solar_web', 'templates', 'solar_web', '*.html'))
css_path = os.path.join(project_dir, 'static', 'css', 'theme.css')

# 1. Update theme.css with Sunset Orange / Amber colors
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

css_replacements = [
    # Dark Mode Updates
    (r'--clr-primary:\s*#38BDF8;', r'--clr-primary:     #F59E0B;'),
    (r'--clr-secondary:\s*#0EA5E9;', r'--clr-secondary:   #F97316;'),
    (r'--clr-primary-glow:\s*rgba\(56,189,248,0\.25\);', r'--clr-primary-glow: rgba(245,158,11,0.25);'),
    (r'--clr-secondary-glow:\s*rgba\(14,165,233,0\.15\);', r'--clr-secondary-glow: rgba(249,115,22,0.15);'),
    
    # Light Mode Updates
    (r'--clr-primary:\s*#0EA5E9;', r'--clr-primary:     #EA580C;'),
    (r'--clr-secondary:\s*#0284C7;', r'--clr-secondary:   #D97706;'),
    (r'--clr-primary-glow:\s*rgba\(14,165,233,0\.15\);', r'--clr-primary-glow: rgba(234,88,12,0.15);'),
    (r'--clr-secondary-glow:\s*rgba\(2,132,199,0\.1\);', r'--clr-secondary-glow: rgba(217,119,6,0.1);')
]

new_css = css_content
for old, new in css_replacements:
    new_css = re.sub(old, new, new_css)

if new_css != css_content:
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(new_css)
    print("Updated theme.css with Sunset Orange palette.")


# 2. Sweep all HTML templates to remove hardcoded sky blue hex codes, amber hex codes, and muddy grays
html_replacements = [
    (r'rgba\(0,0,0,0\.35\)', r'var(--bg-overlay-light)'),
    (r'#38BDF8', r'var(--clr-primary)'),
    (r'rgba\(56,189,248,0\.75\)', r'var(--clr-primary-glow)'),
    (r'#0EA5E9', r'var(--clr-secondary)'),
    (r'#f59e0b', r'var(--clr-secondary)'), # the old amber was used as an accent, map it to secondary
    (r'rgba\(245,158,11,0\.6\)', r'var(--clr-secondary-glow)')
]

count = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = content
    for pattern, repl in html_replacements:
        new_content = re.sub(pattern, repl, new_content, flags=re.IGNORECASE)
        
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print(f"Updated hardcoded hex/rgba in {os.path.basename(file)}")

print(f"Total HTML files updated: {count}")
