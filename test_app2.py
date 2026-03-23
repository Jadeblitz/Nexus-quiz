import re
from playwright.sync_api import Page, expect, sync_playwright

def verify_feature(page: Page):
    page.goto("http://localhost:5173")
    page.wait_for_timeout(2000)

    # Click the "Play as Guest" button
    page.get_by_text("Play as Guest").click()
    page.wait_for_timeout(2000)

    expect(page.get_by_text("Science & Tech")).to_be_visible()
    expect(page.get_by_text("Engineering & Math")).to_be_visible()
    expect(page.get_by_text("History")).to_be_visible()

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_feature(page)
        browser.close()
