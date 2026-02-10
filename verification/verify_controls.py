from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 400, 'height': 800}) # Mobile-ish view
        try:
            print("Navigating to app...")
            page.goto("http://localhost:5173")

            # Wait for intro and close it
            print("Closing intro...")
            # Use a more specific selector or wait
            start_btn = page.locator("button", has_text="Simulation Starten")
            start_btn.wait_for(state="visible", timeout=5000)
            start_btn.click()

            page.wait_for_timeout(1000) # Wait for fade out

            # Check for Mobile Controls
            # They are buttons with arrow text.
            arrows = page.locator("button").filter(has_text="▲")
            if arrows.count() > 0:
                 print(f"Found Up Arrow. Mobile controls visible.")
            else:
                 print("WARNING: Up Arrow not found!")
                 # Log all buttons
                 btns = page.locator("button").all_inner_texts()
                 print(f"Buttons found: {btns}")

            # Check for Size Control (should be absent)
            # Look for label "Größe"
            size_label = page.get_by_text("Größe", exact=True)
            if size_label.count() == 0:
                print("Size control correctly removed.")
            else:
                print("ERROR: Size control still visible!")

            page.screenshot(path="verification/mobile_controls.png")
            print("Screenshot saved to verification/mobile_controls.png")

        except Exception as e:
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            browser.close()

if __name__ == "__main__":
    run()
