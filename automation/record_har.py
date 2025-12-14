from playwright.sync_api import sync_playwright
import time
import argparse

# Default Configuration
DEFAULT_URL = "https://inline.app/booking/-MEfYLIUZiv8LE28Z5HN:inline-live-1"
DEFAULT_DURATION = 120
OUTPUT_FILE = "automation/traffic.har"

def record_har(url, duration):
    print(f"🎥 Starting HAR Recorder...")
    print(f"🔗 URL: {url}")
    print(f"⏱️  Duration: {duration} seconds")
    print(f"💾 Output: {OUTPUT_FILE}")

    with sync_playwright() as p:
        # Launch headful browser so user can interact/see
        browser = p.chromium.launch(
            headless=False,
            args=['--disable-blink-features=AutomationControlled', '--start-maximized']
        )
        
        # Create context with HAR recording enabled
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport=None,
            record_har_path=OUTPUT_FILE
        )
        
        # Stealth
        context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        page = context.new_page()
        
        try:
            print("🚀 Navigating...")
            page.goto(url, wait_until='domcontentloaded')
            
            print(f"✅ Page loaded. Recording traffic for {duration} seconds...")
            print("👉 You can manually interact with the page now (login, click, etc).")
            
            # Show countdown
            for remaining in range(duration, 0, -1):
                print(f"⏳ Closing in {remaining}s...", end='\r')
                time.sleep(1)
            
            print("\n💾 Closing browser to save HAR file...")
            context.close() # Critical to save HAR
            browser.close()
            print(f"✅ Done! HAR saved to {OUTPUT_FILE}")
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            try:
                context.close()
                browser.close()
            except:
                pass

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Record HTTP Traffic (HAR) for Inline.app')
    parser.add_argument('--url', type=str, default=DEFAULT_URL, help='Target URL to record')
    parser.add_argument('--time', type=int, default=DEFAULT_DURATION, help='Duration to record in seconds')
    
    args = parser.parse_args()
    
    record_har(args.url, args.time)
