from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()
        try:
            print("Navigating to app...")
            page.goto("http://localhost:5173")

            # Dismiss Intro
            print("Looking for Start button...")
            start_button = page.get_by_role("button", name="Simulation Starten")
            if start_button.is_visible():
                start_button.click()
                print("Clicked Start button")
            else:
                print("Start button not found, maybe already started?")

            page.wait_for_selector("text=Simulation Starten", state="hidden")
            print("Intro dismissed")

            # Switch to Sphere View
            print("Switching to Sphere view...")
            sphere_btn = page.locator("button:has-text('3D Sphäre')")
            sphere_btn.click()
            print("Clicked Sphere button")

            # Wait for Canvas
            page.wait_for_selector("canvas")
            print("Canvas found")

            # Wait a bit for Three.js to render
            time.sleep(2)

            # Take screenshot
            page.screenshot(path="verification/sphere_visual_check.png")
            print("Screenshot saved to verification/sphere_visual_check.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_state.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
