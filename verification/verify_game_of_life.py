from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})

        print("Loading page...")
        page.goto("http://localhost:5174")

        # Click Start Simulation on Intro
        print("Starting Simulation from Intro...")
        page.get_by_role("button", name="Simulation Starten").click()

        # Verify Canvas
        print("Waiting for Canvas...")
        canvas = page.locator("canvas")
        expect(canvas).to_be_visible()

        # Draw on Canvas (Center)
        box = canvas.bounding_box()
        if box:
            cx = box["x"] + box["width"] / 2
            cy = box["y"] + box["height"] / 2
            page.mouse.click(cx, cy)
            page.mouse.click(cx + 20, cy)
            page.mouse.click(cx - 20, cy)

        # Select Pattern "Glider"
        # Using a more robust selector: Select element that contains option with text "Glider"
        print("Selecting Glider...")
        # There are two selects. One for size, one for pattern.
        # Pattern select has options like "Glider", "LWSS", etc.
        # We can locate the select by filtering for an option text.
        pattern_select = page.locator("select").filter(has=page.locator("option", has_text="Glider"))
        pattern_select.select_option(label="Glider")

        # Start Simulation
        print("Starting Game...")
        page.get_by_role("button", name="Start").click()

        # Wait for a few frames
        page.wait_for_timeout(1000)

        # Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification/game_of_life_verified.png")

        browser.close()
        print("Verification complete!")

if __name__ == "__main__":
    run()
