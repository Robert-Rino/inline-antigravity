import json
from urllib.parse import urlparse

def analyze_har(har_path):
    with open(har_path, 'r', encoding='utf-8') as f:
        har_data = json.load(f)

    entries = har_data['log']['entries']
    
    print(f"Total entries: {len(entries)}")
    print("-" * 50)

    api_calls = []

    for entry in entries:
        req = entry['request']
        url = req['url']
        method = req['method']
        
        # Filter for likely API calls - Strict Host Check
        if url.startswith('https://inline.app') and (
            method == 'POST' or 
            '/api/' in url or 
            '/booking/' in url
        ):
            # content type filter
            mime_type = ""
            for h in req['headers']:
                if h['name'].lower() == 'content-type':
                    mime_type = h['value']
            
            # Skip static assets based on extension or mime if needed
            if any(x in url for x in ['.js', '.css', '.png', '.jpg', '.woff', '.svg']):
                continue
                
            api_calls.append(entry)

    # Print summary of interesting calls
    for i, entry in enumerate(api_calls):
        req = entry['request']
        resp = entry['response']
        print(f"[{i+1}] {req['method']} {req['url']}")
        print(f"    Status: {resp['status']}")
        
        # Print key request headers to track evolution
        req_headers = {h['name'].lower(): h['value'] for h in req['headers'] if h['name'].lower() in ['cookie', 'referer', 'x-csrf-token', 'x-requested-with']}
        if req_headers:
            print(f"    REQ Headers: {req_headers}")
            
        # Print Set-Cookie from response to see if they rotate
        resp_cookies = [h['value'] for h in resp['headers'] if h['name'].lower() == 'set-cookie']
        if resp_cookies:
            print(f"    RESP Set-Cookie: {resp_cookies}")

        # Focused debug on reservations
        if '/reservations/' in req['url']:
             print(f"🎯 Found RESERVATION Request: {req['method']} {req['url']}")
             print(f"    Status: {entry['response']['status']}")
             if req.get('postData'):
                print(f"    Payload: {req['postData'].get('text', '')}")
             if entry['response']['content'].get('text'):
                print(f"    Response: {entry['response']['content']['text'][:500]}")
        
        # General POST survey
        elif req['method'] == 'POST':
             print(f"🔎 Found POST: {req['url']}")
        
        print("-" * 30)

analyze_har('/Users/nino/Repository/inline-antigravity/automation/traffic.har')
