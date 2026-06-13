import re

css_path = r'c:\Project\solar-website-1\static\css\theme.css'
with open(css_path, 'r', encoding='utf-8') as f:
    content = f.read()

light_vars = """
        /* Light Theme Overrides */
        [data-theme="light"] {
            --clr-primary:     #0EA5E9;
            --clr-secondary:   #0284C7;
            --clr-primary-glow: rgba(14,165,233,0.15);
            --clr-secondary-glow: rgba(2,132,199,0.1);
            
            --clr-bg:          #FFFFFF;
            --clr-bg-2:        #F8FAFC;
            --clr-surface:     #F8FAFC;
            --clr-surface-md:  rgba(248,250,252,0.95);
            --clr-border:      #E2E8F0;
            --clr-border-md:   rgba(15,23,42,0.1);
            
            --clr-text-1:      #0F172A;
            --clr-text-2:      #475569;
            --clr-text-3:      #64748B;
            --clr-white:       #ffffff;
            
            /* Shadows for light mode */
            --shadow-sm:  0 2px 8px rgba(15,23,42,0.06);
            --shadow-md:  0 4px 16px rgba(15,23,42,0.08);
            --shadow-lg:  0 12px 32px rgba(15,23,42,0.12);
            --shadow-xl:  0 20px 48px rgba(15,23,42,0.15);
            --shadow-primary: 0 0 30px rgba(14,165,233,0.15), 0 0 60px rgba(14,165,233,0.05);
            --shadow-secondary: 0 0 30px rgba(2,132,199,0.1);
            
            /* Overlays for light mode */
            --bg-overlay: rgba(248,250,252,0.8);
            --bg-overlay-light: rgba(248,250,252,0.6);
            --border-overlay: rgba(15,23,42,0.1);
        }
"""

root_end_match = re.search(r'(:root\s*\{[^}]+\})', content)
if root_end_match:
    root_block = root_end_match.group(1)
    new_content = content.replace(root_block, root_block + '\n' + light_vars)
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Added light theme overrides!')
else:
    print('Could not find :root block!')
