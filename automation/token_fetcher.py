from playwright.sync_api import sync_playwright
import time
import sys

def get_fresh_cookies(target_url):
    """
    Launches a headful browser to pass Cloudflare/PerimeterX challenges 
    and returns the valid cookies dict.
    """
    print("🔓 Launching browser to fetch anti-bot tokens...")
    
    with sync_playwright() as p:
        # Launch headful to look human (essential for some challenges)
        browser = p.chromium.launch(
            headless=False, 
            args=[
                '--disable-blink-features=AutomationControlled',
                '--no-default-browser-check',
                '--start-maximized'
            ]
        )
        
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport=None 
        )
        
        # Stealth Evasion
        context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        page = context.new_page()
        
        try:
            print(f"🔗 Navigating to {target_url}...")
            page.goto(target_url, wait_until='domcontentloaded')

            # Wait for specific anti-bot cookies to appear
            # Usually takes 2-5 seconds for JS to execute
            print("⏳ Waiting for security checks (Cloudflare/PerimeterX)...")
            
            # Smart wait logic: Wait until we see BOTH key cookies or timeout
            start_time = time.time()
            while time.time() - start_time < 20: # Wait up to 20 seconds
                cookies = context.cookies()
                cookie_dict = {c['name']: c['value'] for c in cookies}
                
                # Check what we have
                has_cf = 'cf_clearance' in cookie_dict
                has_px = '_pxhd' in cookie_dict
                
                if has_cf and has_px:
                    print("✅ Detected BOTH anti-bot tokens (cf_clearance & _pxhd)!")
                    break
                
                if has_cf or has_px:
                     # If we have one, just wait a bit more to see if the other comes
                     print(f"⚠️ Found {'cf_clearance' if has_cf else '_pxhd'}, waiting for others...", end='\r')
                
                time.sleep(1)
            
            # Give it one extra second to settle
            time.sleep(2)
            
            # Return ALL cookies, not just specific ones, to ensure session continuity
            final_cookies = {c['name']: c['value'] for c in context.cookies()}
            print(f"🍪 Captured {len(final_cookies)} cookies. (Including: {', '.join(list(final_cookies.keys())[:5])}...)")
            
            browser.close()
            return final_cookies

        except Exception as e:
            print(f"❌ Error fetching tokens: {e}")
            browser.close()
            return {}

if __name__ == "__main__":
    # Test run
    url = "https://inline.app/booking/-MEfYLIUZiv8LE28Z5HN:inline-live-1"
    cookies = get_fresh_cookies(url)
    print("Tokens acquired")
    for key, value in cookies.items() :
        if key in ['cf_clearance', '_pxhd', '_ga']:
            print(f"{key}: {value}")
