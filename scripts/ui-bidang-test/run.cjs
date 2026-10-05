// Run with UI_TEST_PLAYWRIGHT pointing to an installed Playwright package.
// Requests are intercepted; this suite never writes to the real admin API.
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs/promises");
const postcss = require("postcss");
const tailwind = require("tailwindcss");
const webpackPackage = require("next/dist/compiled/webpack/webpack");
webpackPackage.init();
const { chromium } = require(process.env.UI_TEST_PLAYWRIGHT || "playwright");
const root = path.resolve(__dirname, "../..");
const output = path.join(root, ".next/ui-bidang-test");

async function run() {
  const compiler = webpackPackage.webpack({
    mode: "development", devtool: false,
    entry: path.join(__dirname, "entry.tsx"),
    output: { path: output, filename: "bundle.js" },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: { "@": root, "next/image$": path.join(__dirname, "next-stub.tsx"), "next/link$": path.join(__dirname, "next-stub.tsx") }
    },
    module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: path.join(__dirname, "tsx-loader.cjs") }] }
  });
  await new Promise((resolve, reject) => compiler.run((err, stats) => {
    compiler.close(() => {});
    if (err || stats.hasErrors()) reject(err || new Error(stats.toString({ all: false, errors: true })));
    else resolve();
  }));
  const css = (await postcss([tailwind({
    content: [path.join(root, "components/dashboard/BidangManager.tsx"), path.join(root, "components/ui/Button.tsx")],
    theme: { extend: { colors: { cream: "#FAF5EF", orange: "#D96A1C", "orange-soft": "#FDF0E0", brown: "#402312", clay: "#8D6543", red: "#B83935", divider: "#EFE4D6" } } }
  })]).process("@tailwind base; @tailwind utilities;", { from: undefined })).css;
  const bundle = await fs.readFile(path.join(output, "bundle.js"));
  const server = http.createServer((req, res) => {
    if (req.url === "/bundle.js") { res.setHeader("Content-Type", "application/javascript; charset=utf-8"); res.end(bundle); }
    else { res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end(`<style>${css}</style><div id="root" style="padding:20px"></div><script src="/bundle.js"></script>`); }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: "msedge" });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const failures = [];
    page.on("pageerror", (err) => failures.push(err.message));
    let listFails = true, saveFails = true, delaySave = false, releaseSave;
    let saved;
    const record = {
      id: 1, nama_bidang: "Kantor Media dan Informasi", deskripsi: "Deskripsi panjang untuk memeriksa formulir bidang.",
      penanggung_jawab: "Ketua Contoh", jumlah_anggota: 2, gambar: null, gambar_utama: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='140'%3E%3C/svg%3E", quote_utama: null, quote_penutup: null,
      anggota: [{ id: 10, nama_anggota: "Anggota A", jabatan: "Staf", foto: "https://example.invalid/a.jpg", urutan: 0 }, { id: 11, nama_anggota: "Anggota B", jabatan: "Wakil Ketua", foto: null, urutan: 1 }]
    };
    await page.route("**/api/**", async (route) => {
      const method = route.request().method();
      if (method === "GET") await route.fulfill({ status: listFails ? 500 : 200, json: listFails ? { error: "Server uji gagal" } : { data: [record] } });
      else if (method === "DELETE") await route.fulfill({ status: 500, json: { error: "Penghapusan uji gagal" } });
      else {
        saved = route.request().postDataJSON();
        if (delaySave) await new Promise((resolve) => { releaseSave = resolve; });
        await route.fulfill({ status: saveFails ? 500 : 200, json: saveFails ? { error: "Penyimpanan uji gagal" } : { data: record } });
      }
    });
    let acceptConfirm = false;
    page.on("dialog", (dialog) => acceptConfirm ? dialog.accept() : dialog.dismiss());
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.getByText("Server uji gagal", { exact: true }).waitFor();
    assert.equal(await page.getByText("Belum ada data bidang.", { exact: true }).count(), 0);
    listFails = false;
    await page.getByRole("button", { name: "Coba lagi" }).click();
    await page.getByRole("heading", { name: record.nama_bidang }).waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.getByRole("button", { name: "Edit", exact: true }).click();
    await page.getByRole("dialog").waitFor();
    assert.equal(await page.locator("#namaBidang").evaluate((el) => document.activeElement === el), true);
    assert.equal(await page.locator('dialog input[type="file"]').count(), 2);
    await page.getByRole("button", { name: "Hapus gambar", exact: true }).click();
    assert.equal(await page.getByAltText("Pratinjau foto utama").count(), 0);
    assert.equal(await page.getByRole("button", { name: "Hapus gambar", exact: true }).count(), 0);
    const saveBox = await page.getByRole("button", { name: "Simpan Perubahan", exact: true }).boundingBox();
    assert(saveBox && saveBox.y >= 0 && saveBox.y + saveBox.height <= 844);
    await page.getByLabel("Nama Bidang", { exact: false }).fill("Nama berubah");
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 1);
    await page.getByRole("button", { name: "Pindahkan anggota 2 ke atas" }).click();
    await page.getByRole("button", { name: "Simpan Perubahan", exact: true }).click();
    await page.getByText("Penyimpanan uji gagal", { exact: true }).waitFor();
    assert.equal(saved.anggota[0].namaAnggota, "Anggota B");
    assert.equal(saved.anggota[1].foto, "https://example.invalid/a.jpg");
    assert.equal(saved.gambarUtama, "");
    assert.equal(await page.locator("#namaBidang").inputValue(), "Nama berubah");
    saveFails = false; delaySave = true;
    await page.getByRole("button", { name: "Simpan Perubahan", exact: true }).click();
    await page.getByRole("button", { name: "Menyimpan…" }).waitFor();
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 1);
    assert.equal(await page.getByRole("button", { name: "Tutup", exact: true }).isDisabled(), true);
    while (!releaseSave) await new Promise((resolve) => setTimeout(resolve, 10));
    releaseSave();
    await page.getByRole("dialog").waitFor({ state: "detached" });
    await page.getByText("Bidang berhasil diperbarui", { exact: true }).waitFor();
    acceptConfirm = true;
    await page.getByRole("button", { name: "Hapus", exact: true }).click();
    await page.getByText("Penghapusan uji gagal", { exact: true }).waitFor();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByRole("button", { name: `Edit ${record.nama_bidang}`, exact: true }).click();
    await page.getByRole("button", { name: "Batal", exact: true }).click();
    await page.getByRole("dialog").waitFor({ state: "detached" });
    assert.equal(await page.getByRole("button", { name: `Edit ${record.nama_bidang}`, exact: true }).evaluate((el) => document.activeElement === el), true);
    assert.deepEqual(failures, []);
    console.log("PASS: error/retry, mobile width, modal focus, fixed save bar, removed member upload, dirty close, reorder/photo preservation, failed save, busy close protection, delete error, focus return.");
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
run().catch((err) => { console.error(err); process.exitCode = 1; });
