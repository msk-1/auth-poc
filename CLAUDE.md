# auth-poc

OAuth 2.0 / OpenID Connect と SPA × Web API の認証・認可を学ぶプロジェクト。解説を `docs/chapters/` の HTML にまとめて GitHub Pages で公開し、実装例も今後ここに置く。

XSS・CSRF・CORS など Web セキュリティ全般は別プロジェクト（`security-poc`）で扱う。ここでは認証・認可に関わる範囲だけを書き、詳細はそちらへ譲る。

## 執筆ルール

- 本文は常体で書く
- 説明は RFC と OpenID Foundation の仕様に基づく。各章の末尾「根拠とした仕様」に参照した仕様を載せる
- コード・HTTP のやり取り・トークンの値は作例である。作例であることがわかるように書く（コメントに「作例」と書くなど）
- ドラフトの仕様（OAuth 2.1、Browser-Based Apps）を根拠にするときは、ドラフトと明記する
- サイトは独自の HTML で作る。MkDocs などの静的サイト生成ツールは使わない
- デザインは黒基調のモダンな作り（大きく細い見出し、グラデーションとノイズの帯、余白を大きく取る）で統一する。`oracle-xplan-guide` と同じ作りである
- 新しい章は既存の章の HTML をひな形にして書く（`<head>`、`site-header`、`menu-overlay`、`hero`、`page-body`、`page-toc`、`pager`、`site-footer`、末尾の `nav.js` の構造をそろえる）。`body` の `data-root` と `data-page` を正しく設定する。章の題名は `hero` の `h1` に置き、本文の `article` には `h1` を書かない
- 章の題名・タグ・色相は `docs/assets/nav.js` の `CHAPTERS` だけで管理する。トップのカード、全画面メニュー、次の章へのリンクはここから作られる
- まだ書いていない章は `path: null` で載せる。「未公開・随時公開予定」と表示され、リンクは付かない
- 公開サイトなので、学習の進み具合（完了・学習中などの状態）は載せない
- 図はインライン SVG で描き、`site.css` の `xp-*` クラスで色を付ける。色を直接書かない（ライト/ダークの両方で読めるようにするため）
- 罫線文字の枠の中に日本語を入れない。文字幅がそろわず崩れる。表か SVG にする
- 確認は `cd docs && python3 -m http.server 8000` でブラウザ表示して行う
