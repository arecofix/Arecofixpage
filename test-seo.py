import urllib.request
import html.parser

class Parser(html.parser.HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag in ['meta', 'link']:
            attrs_dict = dict(attrs)
            if 'property' in attrs_dict and attrs_dict['property'].startswith('og:'):
                print(f"{attrs_dict['property']}: {attrs_dict.get('content')}")
            elif 'name' in attrs_dict and attrs_dict['name'] == 'description':
                print(f"description: {attrs_dict.get('content')}")
            elif tag == 'link' and attrs_dict.get('rel') == 'canonical':
                print(f"canonical: {attrs_dict.get('href')}")

url = 'https://arecofix.com.ar/academy'
req = urllib.request.Request(url, headers={'User-Agent': 'facebookexternalhit/1.1'})
response = urllib.request.urlopen(req)
html_content = response.read().decode('utf-8')

p = Parser()
p.feed(html_content)
