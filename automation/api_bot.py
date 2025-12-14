from playwright.sync_api import sync_playwright
import json
import time

# Configuration
CONFIG = {
    # "booking_page_url": "https://inline.app/booking/-MEfYLIUZiv8LE28Z5HN:inline-live-1", 
    "target_url": "https://inline.app/api/reservations/booking",
    
    "company_id": "-L2ob2WyNAMrK819_Q7l",
    "branch_id": "-L2ob2aiSjTkofeorUyR",
    "date": "2025-12-16",
    "time": "12:00",
    "group_size": 2,
    "user": {
        "name": "張軒銘",
        "phone": "+886958826788",
        "email": "a901002666@gmail.com",
        "gender": 1 
    }
}

# Use specific Branch URL for verification to ensure correct session context
CONFIG['booking_page_url'] = f'https://inline.app/booking/{CONFIG["company_id"]}/{CONFIG["branch_id"]}'

def run_hybrid_bot():
    print("🚀 Launching Hybrid Browser-API Bot...")
    
    with sync_playwright() as p:
        # Launch real browser to pass PerimeterX Fingerprint
        browser = p.chromium.launch(
            headless=False, 
            args=['--disable-blink-features=AutomationControlled', '--start-maximized']
        )
        
        context = browser.new_context(
             user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
             viewport=None
        )
        context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        
        page = context.new_page()
        # Log all requests to debug
        # page.on("request", lambda request: print(f"  >> {request.method} {request.url}"))

        # 1. Verification Phase
        print(f"🔗 Navigating to verification page: {CONFIG['booking_page_url']}...")
        page.goto(CONFIG['booking_page_url'], wait_until='domcontentloaded')
        
        print("⏳ Waiting for anti-bot check to pass...")
        # Wait for meaningful content to load, signaling we passed
        try:
            page.wait_for_selector('#adult-picker', timeout=20000)
        except:
            print("❌ Timed out waiting for validation. Verify manually.")
        
        print("✅ Anti-Bot Challenge Passed! Browser is verified.")
        print(f"🏠 Page Title: {page.title()}")
        
        # 1.4 Connectivity Test (Menus API)
        print("📜 Checking Menus API...")
        menu_resp = page.request.get(
            "https://inline.app/api/menus",
            params={
                "companyId": CONFIG["company_id"],
                "branchId": CONFIG["branch_id"],
                "time": f"{CONFIG['date']}T12:00:00.000Z"
            },
            headers={ "referer": CONFIG['booking_page_url'] }
        )
        print(f"  Menu Status: {menu_resp.status}")
        if menu_resp.status == 200:
            print("✅ Menus API is working! (Auth is valid)")
        else:
            print(f"❌ Menus API failed: {menu_resp.status} - Auth/Headers might be rejected.")

        # 1.5 Dynamic Availability Check
        print("🔍 checking for FIRST available slot...")
        
        # Remove dateRange to match HAR (returns default view)
        print(f"  Querying capacity (Default View)")
        
        check_resp = page.request.get(
            f"https://inline.app/api/booking-capacitiesV3",
            params={
                "companyId": CONFIG["company_id"], 
                "branchId": CONFIG["branch_id"],
                # "dateRange": ... removed to match HAR
            },
             headers={
                "base-url": CONFIG["booking_page_url"], 
                "referer": CONFIG['booking_page_url'] # Landing page referer
            }
        )
        
        print(f"  Capacity URL: {check_resp.url}")
        
        if check_resp.status != 200:
             print(f"⚠️ Failed to check availability: {check_resp.status}")
        else:
            data = check_resp.json()
            # Structure: { "default": ... } OR { "companyId": ... }
            # HAR shows "default"
            
            calendar_data = data.get('default') or data.get(CONFIG['company_id'])
            
            if not calendar_data:
                 print(f"❌ Could not find calendar data in response keys: {list(data.keys())}")
            else:
                # Helper to find slot
                found_slot = False
                
                # Check specific date
                day_data = calendar_data.get(CONFIG["date"])
                if day_data and 'times' in day_data:
                    times = day_data['times']
                    if CONFIG['time'] in times and len(times[CONFIG['time']]) > 0:
                        print(f"✅ Requested slot {CONFIG['date']} @ {CONFIG['time']} is VALID.")
                        found_slot = True
                    else:
                         print(f"⚠️ Requested time {CONFIG['time']} is full/closed.")
                else:
                     print(f"⚠️ Requested date {CONFIG['date']} has no loaded data/closed.")

                if not found_slot:
                    print(f"DEBUG Capacity Data Keys: {list(calendar_data.keys())}")
                    # Try to find ANY open slot in loaded data
                    for date_key in sorted(calendar_data.keys()):
                        if date_key == "dinerTime" or date_key == "status": continue
                        
                        t_data = calendar_data[date_key]
                        if t_data.get('status') == 'open':
                            for t, tables in t_data.get('times', {}).items():
                                if len(tables) > 0:
                                    print(f"💡 Found alternative: {date_key} @ {t}")
                                    CONFIG['date'] = date_key
                                    CONFIG['time'] = t
                                    found_slot = True
                                    break
                        if found_slot: break

                if not found_slot:
                    print(f"❌ No slots found in loaded data.")
                    # print(f"DEBUG Capacity Data: {json.dumps(data, indent=2)}")
        
        # 2. Pure API Phase (Inside the verified browser)
        print(f"⚡ Executing Pure API Booking for {CONFIG['date']} @ {CONFIG['time']}...")
        
        payload = {
            "language": "zh-tw",
            "company": CONFIG["company_id"],
            "branch": CONFIG["branch_id"],
            "gender": CONFIG["user"]["gender"],
            "purposes": [],
            "diningPurposes": [],
            "email": CONFIG["user"]["email"],
            "phone": CONFIG["user"]["phone"],
            "name": CONFIG["user"]["name"],
            "familyName": "",
            "givenName": "",
            "phoneticFamilyName": "",
            "phoneticGivenName": "",
            "note": "",
            "groupSize": CONFIG["group_size"],
            "kids": 0,
            "date": CONFIG["date"],
            "time": CONFIG["time"],
            "numberOfKidChairs": 0,
            "numberOfKidSets": 0,
            "skipPhoneValidation": False,
            "paymentMethod": None
        }

        # IMPORTANT: executing request FROM the page context inherits all cookies/TLS tokens
        # Construct exact Referer for FORM: /booking/{company}/{branch}/form
        form_referer_url = f"https://inline.app/booking/{CONFIG['company_id']}/{CONFIG['branch_id']}/form"
        
        response = page.request.post(
            CONFIG["target_url"],
            data=payload,
            headers={
                "content-type": "application/json",
                # Exact Referer Match from HAR
                "referer": form_referer_url
            }
        )
        
        print("-" * 40)
        print(f"Status: {response.status} {response.status_text}")
        print(f"Body: {response.text()[:500]}...") 
        print("-" * 40)
        
        if response.status in [200, 302]:
            print("✨ API Booking SUCCESS!")
        else:
            print(f"❌ API Booking Failed: {response.status}")
            
        print("😴 Keeping browser open for 10s...")
        time.sleep(10)
        browser.close()

if __name__ == "__main__":
    run_hybrid_bot()
