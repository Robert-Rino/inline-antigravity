export const utils = {
    // Random sleep between actions
    async randomDelay(page, min = 500, max = 1500) {
        const delay = Math.floor(Math.random() * (max - min) + min);
        await page.waitForTimeout(delay);
    },

    // Simulate human mouse movement
    async humanMouseMove(page) {
        // Move mouse in a random curve or to random points
        const width = page.viewportSize()?.width || 1280;
        const height = page.viewportSize()?.height || 720;

        // Pick random target
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);

        // Playwright mouse move is instant, so we step it
        const steps = 10;
        await page.mouse.move(x, y, { steps: steps });
    },

    // Click with small random variance
    async humanClick(page, selectorOrLocator) {
        let locator;
        if (typeof selectorOrLocator === 'string') {
            locator = page.locator(selectorOrLocator);
        } else {
            locator = selectorOrLocator;
        }

        const box = await locator.boundingBox();

        if (box) {
            // Move to the element first with "momentum" (overshoot slightly then correct? or just random points)
            // Simple random curve simulation by moving to an intermediate point first

            // Random jitter inside the box
            const targetX = box.x + box.width / 2 + (Math.random() * 10 - 5);
            const targetY = box.y + box.height / 2 + (Math.random() * 10 - 5);

            // Move with steps to simulate speed
            await page.mouse.move(targetX, targetY, { steps: Math.floor(Math.random() * 5) + 5 });

            await this.randomDelay(page, 100, 300);
            await page.mouse.down();
            await this.randomDelay(page, 50, 150);
            await page.mouse.up();
        } else {
            await locator.click();
        }
    },

    // Human-like typing
    async humanType(page, selector, text) {
        const input = page.locator(selector);
        await this.humanClick(page, input);

        // Type character by character with rhythm
        for (const char of text) {
            await page.keyboard.type(char);
            // Random delay between keystrokes: fast typing with occasional pauses
            await this.randomDelay(page, 30, 100);

            // Occasional long pause (thinking time)
            if (Math.random() < 0.1) {
                await this.randomDelay(page, 200, 500);
            }
        }
    }
};
