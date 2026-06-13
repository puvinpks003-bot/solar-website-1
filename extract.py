import os, re

base_html = r'c:\Project\solar-website-1\solar_web\templates\solar_web\base.html'
css_dir = r'c:\Project\solar-website-1\static\css'
js_dir = r'c:\Project\solar-website-1\static\js'

os.makedirs(css_dir, exist_ok=True)
os.makedirs(js_dir, exist_ok=True)

with open(base_html, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract CSS
style_start = content.find('<style>')
style_end = content.find('</style>')
if style_start != -1 and style_end != -1:
    css_content = content[style_start+7:style_end].strip()
    with open(os.path.join(css_dir, 'theme.css'), 'w', encoding='utf-8') as f:
        f.write(css_content)
    
    link_tag = '<link rel="stylesheet" href="{% static \'css/theme.css\' %}">'
    content = content[:style_start] + link_tag + content[style_end+8:]

# 2. Extract Bottom JS
script_start_idx = content.rfind('<script>')
script_end_idx = content.rfind('</script>')
if script_start_idx != -1 and script_end_idx != -1:
    js_content = content[script_start_idx+8:script_end_idx].strip()
    with open(os.path.join(js_dir, 'main.js'), 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    script_tag = '<script src="{% static \'js/main.js\' %}" defer></script>'
    content = content[:script_start_idx] + script_tag + content[script_end_idx+9:]

# 3. Handle the top script in <head> for FOUC
fouc_script = """<script>
        (function() {
            try {
                var storedTheme = localStorage.getItem('theme');
                var sysPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                if (storedTheme === 'light' || (!storedTheme && sysPrefersLight)) {
                    document.documentElement.setAttribute('data-theme', 'light');
                }
            } catch (e) {}
        })();
    </script>"""

# Replace the existing small script in head
head_script_start = content.find('<script>')
head_script_end = content.find('</script>')
if head_script_start != -1 and head_script_start < content.find('</head>'):
    content = content[:head_script_start] + fouc_script + content[head_script_end+9:]

# 4. Ensure {% load static %} is at the top
if '{% load static %}' not in content:
    content = '{% load static %}\n' + content

with open(base_html, 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully extracted CSS and JS and updated base.html!')
