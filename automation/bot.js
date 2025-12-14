import { chromium } from 'playwright';
import { config } from './config.js';
import { utils } from './utils.js';

async function runBot() {
    console.log('🤖 launching Booking Bot (Strict Mode)...');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100,
        args: [
            '--start-maximized',
            '--disable-blink-features=AutomationControlled',
            '--disable-infobars',
            '--no-default-browser-check'
        ]
    });

    const context = await browser.newContext({
        viewport: null,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        recordHar: {
            path: 'automation/traffic.har'
        }
    });

    await context.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
    });

    const page = await context.newPage();

    try {
        // 1. Go to targetUrl
        console.log(`🔗 Navigating to: ${config.targetUrl}`);
        await page.goto(config.targetUrl, { waitUntil: 'domcontentloaded' });
        await utils.randomDelay(page, 1000, 2000);

        // 2. Set Party Size
        // User request: click <select> (id="adult-picker") and set to partySize
        console.log(`👤 Setting party size to ${config.partySize}...`);
        const adultPickerId = '#adult-picker';

        // Check if it's a standard select element or needs clicking
        try {
            const isSelect = await page.$eval(adultPickerId, el => el.tagName === 'SELECT');
            if (isSelect) {
                await page.selectOption(adultPickerId, String(config.partySize));
            } else {
                // If it's a custom UI pretending to be a select
                await utils.humanClick(page, adultPickerId);
                await utils.randomDelay(page, 500, 1000);
                await page.getByText(String(config.partySize), { exact: true }).click();
            }
        } catch (e) {
            console.log(`⚠️  Could not interact with ${adultPickerId} as select. Trying click fallback...`);
            await utils.humanClick(page, adultPickerId);
            await utils.randomDelay(page, 500, 1000);
            await page.getByText(String(config.partySize), { exact: true }).first().click();
        }

        // 3. Select Date
        // User request: click <div> (id="date-picker"), select preferredDate
        if (config.preferredDate) {
            console.log(`📅 Selecting date: ${config.preferredDate}...`);

            // Wait for any potential re-renders after party size change
            await page.waitForTimeout(1000);

            // Ensure element is ready
            await page.waitForSelector('#date-picker', { state: 'visible' });

            // Try clicking
            await utils.humanClick(page, '#date-picker');

            // Wait for calendar to appear
            // If it doesn't appear, maybe the click failed?
            try {
                await page.waitForSelector('#calendar-picker, .calendar-container, .react-datepicker', { state: 'visible', timeout: 2000 });
            } catch (e) {
                console.log('⚠️ Calendar did not open on first click. Retrying...');
                await page.click('#date-picker', { force: true });
            }

            await page.waitForTimeout(1000); // Wait for open animation

            // Logic: select preferredDate from UI
            // Assuming the simple number matching logic is still desired inside the picker
            // We use exact text match for the day number
            const dateSelector = `text="${config.preferredDate}"`;
            await utils.humanClick(page, page.locator(dateSelector).first());
        }

        await utils.randomDelay(page, 1000, 2000);

        // 4. Select Time
        // User request: Click <div> (id="book-now-content") -> span (class="text-md text-center leading-none") with text preferredTime
        console.log(`⏰ Selecting time: ${config.preferredTime}...`);

        const timeContainer = page.locator('#book-now-content');
        // Combined selector for the specific span
        const timeSpan = timeContainer.locator(`span.text-md.text-center.leading-none:has-text("${config.preferredTime}")`);

        if (await timeSpan.isVisible()) {
            await utils.humanClick(page, timeSpan);
            console.log('✅ Clicked time slot.');
        } else {
            console.warn(`⚠️ Time slot "${config.preferredTime}" not visible. Trying exact text match on any span in container...`);
            // Fallback: simpler text match
            await utils.humanClick(page, timeContainer.locator(`span:has-text("${config.preferredTime}")`).first());
        }

        await utils.randomDelay(page, 500, 1000);

        // 5. Click Next/Book Button
        // User request: click <button> (data-cy="book-now-action-button")
        console.log('👉 Clicking "Next" button...');
        await utils.humanClick(page, 'button[data-cy="book-now-action-button"]');

        // Check for CAPTCHA/Auth here - Replaced with auto-detect
        console.log('⏳ Waiting for Reservation Info form to load...');

        // Wait for the name input to appear, indicating the form is ready
        // Increase timeout to 30s just in case of slow redirect or CAPTCHA check
        await page.waitForSelector('#name', { state: 'visible', timeout: 30000 });
        console.log('✅ Form loaded. Auto-filling...');

        // 6. Fill Form - Instant Speed
        // User requested instant filling, not bot-like
        console.log('📝 Filling contact info instantly...');
        await page.fill('#name', config.user.name);
        await page.fill('#phone', config.user.phone);
        await page.fill('#email', config.user.email);

        // Short delay to ensure React state updates
        await page.waitForTimeout(500);

        // 7. Submit
        console.log('🚀 Submitting reservation...');
        // User request: click <button type="submit">
        const submitBtn = 'button[type="submit"]';

        // Click immediately
        await utils.humanClick(page, submitBtn);

        console.log('✨ Script complete. Reservation submitted.');
        console.log('👉 Leaving window open for you to finalize.');

        // Keep open for a short while to ensure submission goes through and traffic is recorded
        console.log('⏳ Waiting 20 seconds for submission response and HAR recording...');
        await page.waitForTimeout(20000);

        console.log('💾 Closing browser to save traffic.har...');
        await context.close();
        await browser.close();
        console.log('✅ HAR file saved to automation/traffic.har');

    } catch (error) {
        console.error('❌ Error in automation:', error);
        // Ensure we close even on error to save whatever traffic we got
        try {
            await context.close();
            await browser.close();
        } catch (e) { }
    }
}

runBot();
