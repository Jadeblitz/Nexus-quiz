from playwright.sync_api import sync_playwright
import time
import subprocess

def run():
    server = subprocess.Popen(["npx", "vite", "--port", "5174", "--host", "127.0.0.1"])
    time.sleep(4)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        page.goto("http://127.0.0.1:5174")
        time.sleep(4)

        browser.close()
    server.kill()

run()
