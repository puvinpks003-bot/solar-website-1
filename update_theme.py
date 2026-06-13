import os, re

theme_css = r'c:\Project\solar-website-1\static\css\theme.css'

with open(theme_css, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace global variable usages
content = content.replace('--clr-gold-glow', '--clr-primary-glow')
content = content.replace('--clr-gold-dim', '--clr-primary')
content = content.replace('--clr-gold', '--clr-primary')

content = content.replace('--clr-blue-dim', '--clr-secondary-glow')
content = content.replace('--clr-blue', '--clr-secondary')

content = content.replace('--shadow-gold', '--shadow-primary')
content = content.replace('--shadow-blue', '--shadow-secondary')

# We need to completely rewrite the :root variables for Colors and Shadows, and the whole [data-theme="light"] block.
# Finding :root
root_match = re.search(r':root\s*\{.*?(/\*\s*Typography\s*\*/)', content, re.DOTALL)
if root_match:
    new_colors = """
            /* Colors */
            --clr-primary:     #38BDF8;
            --clr-secondary:   #0EA5E9;
            --clr-primary-glow: rgba(56,189,248,0.25);
            --clr-secondary-glow: rgba(14,165,233,0.15);
            
            --clr-bg:          #0F172A;
            --clr-bg-2:        #1E293B;
            --clr-surface:     #1E293B;
            --clr-surface-md:  rgba(30,41,59,0.95);
            --clr-border:      #334155;
            --clr-border-md:   rgba(255,255,255,0.14);
            
            --clr-text-1:      #F8FAFC;
            --clr-text-2:      #CBD5E1;
            --clr-text-3:      #94A3B8;
            --clr-white:       #ffffff;

            """
    content = content[:root_match.start()] + ":root {" + new_colors + root_match.group(1) + content[root_match.end():]

# Now Shadows
shadows_match = re.search(r'(/\*\s*Shadows\s*\*/).*?(/\*\s*Radii\s*\*/)', content, re.DOTALL)
if shadows_match:
    new_shadows = """/* Shadows */
            --shadow-sm:  0 1px 3px rgba(0,0,0,0.4);
            --shadow-md:  0 4px 20px rgba(0,0,0,0.5);
            --shadow-lg:  0 12px 40px rgba(0,0,0,0.6);
            --shadow-xl:  0 24px 64px rgba(0,0,0,0.7);
            --shadow-primary: 0 0 30px rgba(56,189,248,0.2), 0 0 60px rgba(56,189,248,0.08);
            --shadow-secondary: 0 0 30px rgba(14,165,233,0.15);

            """
    content = content[:shadows_match.start()] + new_shadows + shadows_match.group(2) + content[shadows_match.end():]

# Now Theme adaptive
theme_match = re.search(r'(/\*\s*Theme-adaptive components\s*\*/).*?(\})', content, re.DOTALL)
if theme_match:
    new_theme = """/* Theme-adaptive components */
            --bg-glass: linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.92) 100%);
            --bg-card: linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.93));
            --grid-line: rgba(255,255,255,0.04);
            --bg-overlay-heavy: rgba(0,0,0,0.5);
            --bg-overlay: rgba(0,0,0,0.4);
            --border-overlay: rgba(255,255,255,0.06);
            --bg-overlay-light: rgba(255,255,255,0.04);
            --hero-text-grad: linear-gradient(160deg, #ffffff 0%, #f1f5f9 40%, #94a3b8 100%);
            
            /* Navbar Variables */
            --bg-nav: rgba(15,23,42,0.85);
            --clr-nav-link: #cbd5e1;
            --bg-nav-link-hover: rgba(255,255,255,0.06);
            --bg-nav-link-active: rgba(0,0,0,0.5);
            --border-nav-link-active: rgba(255,255,255,0.15);
            --bg-footer: linear-gradient(to bottom, #020617, #0F172A);
        }"""
    content = content[:theme_match.start()] + new_theme + content[theme_match.end():]

# Finally Light Theme Overrides
light_match = re.search(r'\[data-theme="light"\]\s*\{.*?\}', content, re.DOTALL)
if light_match:
    new_light = """[data-theme="light"] {
            --clr-primary:     #0EA5E9;
            --clr-secondary:   #0284C7;
            --clr-primary-glow: rgba(14,165,233,0.15);
            --clr-secondary-glow: rgba(2,132,199,0.1);
            
            --clr-bg:          #FFFFFF;
            --clr-bg-2:        #F8FAFC;
            --clr-surface:     #F8FAFC;
            --clr-surface-md:  rgba(248,250,252,0.95);
            --clr-border:      #E2E8F0;
            --clr-border-md:   rgba(0,0,0,0.15);
            
            --clr-text-1:      #0F172A;
            --clr-text-2:      #475569;
            --clr-text-3:      #64748B;
            --clr-white:       #ffffff;
            
            /* Light Shadows */
            --shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
            --shadow-md:  0 4px 12px rgba(0,0,0,0.05);
            --shadow-lg:  0 12px 24px rgba(0,0,0,0.05);
            --shadow-xl:  0 20px 40px rgba(0,0,0,0.08);
            --shadow-primary: 0 0 20px rgba(14,165,233,0.15), 0 0 40px rgba(14,165,233,0.05);
            --shadow-secondary: 0 0 20px rgba(2,132,199,0.1);
            
            /* Theme Adaptive */
            --bg-glass:        rgba(255, 255, 255, 0.85);
            --bg-card:         #ffffff;
            --grid-line:       rgba(0, 0, 0, 0.05);
            --bg-overlay-heavy: rgba(255, 255, 255, 0.9);
            --bg-overlay: rgba(255, 255, 255, 0.7);
            --border-overlay: rgba(0,0,0,0.06);
            --bg-overlay-light: rgba(0, 0, 0, 0.04);
            --hero-text-grad:  linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #475569 100%);
            
            /* Navbar Overrides */
            --bg-nav: rgba(255,255,255,0.85);
            --clr-nav-link: #475569;
            --bg-nav-link-hover: rgba(0,0,0,0.04);
            --bg-nav-link-active: rgba(0,0,0,0.06);
            --border-nav-link-active: rgba(0,0,0,0.1);
            --bg-footer: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
        }"""
    content = content[:light_match.start()] + new_light + content[light_match.end():]

# Global smooth transition for background colors
content += "\n/* Global Theme Transition */\nbody, header, footer, .nav-inner, .nav-link, .card, .glass-panel, .metric-box, section, div, span, a, p, h1, h2, h3, h4, h5, h6 {\n    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;\n}\n"

with open(theme_css, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated theme.css!")
