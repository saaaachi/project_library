
# ======================================
# Project Library
# SEO Generator Test Workflow
# Version 1.3
# ======================================

name: Project Library SEO Test

on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  test-seo:
    runs-on: ubuntu-latest

    steps:

      # ----------------------------------
      # リポジトリ取得
      # ----------------------------------

      - name: Checkout repository
        uses: actions/checkout@v4

      # ----------------------------------
      # Node.js設定
      # ----------------------------------

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      # ----------------------------------
      # JavaScript構文確認
      # ----------------------------------

      - name: Check JavaScript syntax
        run: |
          node --check tools/generate-seo.js
          node --check tools/build-pages.js
          node --check assets/js/work.js
          node --check assets/js/common.js

      # ----------------------------------
      # 大カテゴリ・小カテゴリ必須検証
      # ----------------------------------

      - name: Validate required categories
        shell: bash
        run: |
          node <<'JS'
          const fs = require("fs");
          const vm = require("vm");

          const source = fs.readFileSync(
            "assets/data/works.js",
            "utf8"
          );

          const startMarker = "const works = ";
          const endMarker =
            "// --------------------------\n// 共通関数";

          const start = source.indexOf(startMarker);
          const end = source.indexOf(endMarker);

          if (
            start === -1 ||
            end === -1 ||
            end <= start
          ) {
            throw new Error(
              "作品データの構造を確認できません"
            );
          }

          const expression = source
            .slice(start + startMarker.length, end)
            .trim()
            .replace(/;\s*$/, "");

          const works = vm.runInNewContext(
            expression,
            Object.create(null),
            { timeout: 5000 }
          );

          if (!Array.isArray(works)) {
            throw new Error("作品データが配列ではありません");
          }

          if (works.length === 0) {
            throw new Error("登録作品がありません");
          }

          function hasValue(value) {
            const items = Array.isArray(value)
              ? value
              : [value];

            return items.some(item =>
              typeof item === "string" &&
              item.trim().length > 0
            );
          }

          for (const work of works) {
            if (!hasValue(work.category)) {
              throw new Error(
                `作品${work.id}: 大カテゴリがありません`
              );
            }

            if (!hasValue(work.fixedTags)) {
              throw new Error(
                `作品${work.id}: 小カテゴリがありません`
              );
            }
          }

          console.log(
            `大カテゴリ・小カテゴリ: ${works.length}件 OK`
          );
          JS

      # ----------------------------------
      # SEOページ・公開用フォルダ生成
      # ----------------------------------

      - name: Build SEO preview site
        run: node tools/build-pages.js

      # ----------------------------------
      # HTML・サイトマップ・公開物検証
      # ----------------------------------

      - name: Validate SEO files
        shell: bash
        run: |
          python3 - <<'PY'
          import re
          import xml.etree.ElementTree as ET
          from pathlib import Path

          root = Path("dist")
          pages = sorted(
              (root / "works").glob("*.html")
          )

          assert pages, (
              "SEO作品HTMLが生成されていません"
          )

          required_files = [
              "index.html",
              "library.html",
              "work.html",
              "assets/data/works.js",
              "assets/js/common.js",
              "assets/js/work.js",
              "assets/css/style.css",
              "sitemap.xml",
              "robots.txt",
              "_headers"
          ]

          for file in required_files:
              assert (root / file).is_file(), (
                  f"公開用ファイルがありません: {file}"
              )

          for directory in [
              "assets/pdf",
              "assets/images/thumbnail",
              "components"
          ]:
              assert (root / directory).is_dir(), (
                  f"公開用フォルダがありません: {directory}"
              )

          required_html = [
              'rel="canonical"',
              'property="og:title"',
              'property="og:description"',
              'property="og:image"',
              '<h1',
              'id="workArea"',
              'id="pdfDownloadButton"',
              'id="pdfDownloadHelp"',
              'id="seriesArea"',
              'id="relatedArea"',
              'id="moveArea"',
              'id="header"',
              'id="sidebar"',
              'id="footer"',
              'data-project-library-tag=',
              '../assets/data/works.js',
              '../assets/js/common.js',
              '../assets/js/work.js'
          ]

          for page in pages:
              content = page.read_text(
                  encoding="utf-8"
              )

              for marker in required_html:
                  assert marker in content, (
                      f"{page}: {marker} がありません"
                  )

              assert content.count(
                  'class="work-ad-100"'
              ) == 2, (
                  f"{page}: 広告枠が2つではありません"
              )

              assert content.count(
                  'id="pdfDownloadButton"'
              ) == 1, (
                  f"{page}: PDFボタンが重複しています"
              )

              assert len(re.findall(
                  r"<h1(?:\s|>)",
                  content
              )) == 1, (
                  f"{page}: h1が重複しています"
              )

              assert (
                  'https://saaaachi.github.io/'
                  'project_library/works/'
                  + page.name
              ) in content, (
                  f"{page}: 本番canonicalがありません"
              )

          tree = ET.parse(
              root / "sitemap.xml"
          )

          namespace = {
              "s":
              "http://www.sitemaps.org/schemas/sitemap/0.9"
          }

          urls = [
              element.text
              for element in tree.findall(
                  ".//s:loc",
                  namespace
              )
          ]

          expected_count = len(pages) + 2

          assert len(urls) == expected_count, (
              f"URL数が不一致: {len(urls)}"
              f" / 期待値: {expected_count}"
          )

          assert len(urls) == len(set(urls)), (
              "サイトマップにURL重複があります"
          )

          for page in pages:
              expected_url = (
                  "https://saaaachi.github.io/"
                  "project_library/works/"
                  + page.name
              )

              assert expected_url in urls, (
                  f"サイトマップに未登録: {page.name}"
              )

          robots = (
              root / "robots.txt"
          ).read_text(encoding="utf-8")

          headers = (
              root / "_headers"
          ).read_text(encoding="utf-8")

          assert "Disallow: /" in robots, (
              "テストサイトのrobots設定がありません"
          )

          assert "noindex" in headers.lower(), (
              "テストサイトのnoindex設定がありません"
          )

          for forbidden in [
              ".github",
              "tools",
              "admin.html",
              "admin-login.html"
          ]:
              assert not (root / forbidden).exists(), (
                  f"公開対象に管理用ファイルがあります: {forbidden}"
              )

          print("==============================")
          print("Project Library SEO Test")
          print("Version 1.3")
          print("==============================")
          print(f"作品HTML: {len(pages)}件 OK")
          print(f"サイトマップ: {len(urls)}件 OK")
          print("SEO基本タグ: OK")
          print("JavaScript読み込み: OK")
          print("PDFボタン: OK")
          print("広告枠: OK")
          print("シリーズ・関連作品領域: OK")
          print("共通レイアウト領域: OK")
          print("公開用フォルダ: OK")
          print("管理用ファイル除外: OK")
          print("テストサイトnoindex: OK")
          print("URL重複: なし")
          print("==============================")
          print("SEOテスト成功！")
          PY

      # ----------------------------------
      # テスト成果物を保存
      # ----------------------------------

      - name: Upload SEO test files
        uses: actions/upload-artifact@v4
        with:
          name: project-library-seo-test
          path: |
            dist/works/
            dist/sitemap.xml
          retention-days: 7

# ======================================
# テスト専用
#
# ・本番公開しない
# ・mainへ自動pushしない
# ・publish.ymlは変更しない
# ・delete.ymlは変更しない
# ・大カテゴリ・小カテゴリ必須
# ・自由タグは任意
# ======================================
