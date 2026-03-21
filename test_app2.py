from playwright.sync_api import sync_playwright
import time
import os

def verify_feature():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/home/jules/verification/video")
        page = context.new_page()
        try:
            page.goto("http://127.0.0.1:5173")
            time.sleep(2)

            # Dismiss alert if any
            page.on("dialog", lambda dialog: dialog.accept())

            page.wait_for_selector("text=Welcome", timeout=10000)
            page.wait_for_selector("text=Log in to sync your progress", timeout=10000)

            # Type something
            page.fill("input[type='email']", "test@test.com")
            page.fill("input[type='password']", "password")
            time.sleep(1)

            # Click the buttons to ensure they're interactive (will show "Failed" due to no real firebase setup, but that's fine, we want to see the UI)
            page.click("button:has-text('Log In')")
            time.sleep(1)

            # Ensure social buttons exist
            page.wait_for_selector("button:has-text('Google')")
            page.wait_for_selector("button:has-text('Facebook')")

            # Take screenshot
            os.makedirs("/home/jules/verification", exist_ok=True)
            page.screenshot(path="/home/jules/verification/verification.png")

        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    verify_feature()
