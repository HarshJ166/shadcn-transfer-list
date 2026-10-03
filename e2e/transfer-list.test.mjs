import { chromium } from "playwright"
import assert from "node:assert/strict"

const urls = process.argv.length > 2 ? process.argv.slice(2) : ["http://localhost:3000"]
const browser = await chromium.launch({ channel: "chrome" })

for (const url of urls) {
  const page = await browser.newPage()
  const errors = []
  page.on("pageerror", (e) => errors.push(e.message))
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
  await page.goto(url, { waitUntil: "networkidle" })

  const left = page.getByRole("group", { name: "Frameworks" })
  const right = page.getByRole("group", { name: "Your stack" })
  const value = () => page.locator("pre").innerText().then(JSON.parse)
  const btn = (name) => page.getByRole("button", { name, exact: true })

  assert.deepEqual(await value(), ["astro"])
  assert.equal(await btn("Move checked to Your stack").isDisabled(), true)

  // check two items via label click, move right
  await left.getByText("Next.js").click()
  await left.getByText("Vite").click()
  await btn("Move checked to Your stack").click()
  assert.deepEqual(await value(), ["astro", "next", "vite"])
  await right.getByText("Vite").waitFor()

  // search filters
  await left.getByRole("searchbox").fill("sv")
  assert.equal(await left.getByRole("listitem").count(), 1)
  await left.getByRole("searchbox").fill("")

  // move all right skips disabled Gatsby
  await btn("Move all to Your stack").click()
  assert.equal((await value()).includes("gatsby"), false)
  assert.equal((await value()).length, 9)
  assert.equal(await btn("Move all to Your stack").isDisabled(), true)

  // check-all on right then move back left
  await right.getByRole("checkbox", { name: "Check all in Your stack" }).click()
  await btn("Move checked to Frameworks").click()
  assert.deepEqual(await value(), [])

  // keyboard: tab to first row checkbox, space, then move
  await left.getByRole("searchbox").focus()
  await page.keyboard.press("Tab")
  await page.keyboard.press("Space")
  await btn("Move checked to Your stack").click()
  assert.equal((await value()).length, 1)

  assert.deepEqual(errors, [], "console errors: " + errors.join("\n"))
  console.log("PASS", url)
  await page.close()
}
await browser.close()
