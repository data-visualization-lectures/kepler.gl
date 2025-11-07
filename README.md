# セットアップおよびインストールログ

本リポジトリを Netlify で静的ホスティングするために行うローカルセットアップ／ビルド手順を、時系列ログとしてまとめる。環境は macOS / zsh を想定。

## 1. Node.js と Yarn の準備
- `nvm install 18.18.2 && nvm use 18.18.2`
- `node -v` で 18.18.2 系を確認。
- `corepack enable`
- `corepack prepare yarn@4.4.0 --activate`
- Homebrew 版 Yarn を残す場合は `corepack` 経由で呼び出す：`corepack yarn -v`（4.4.0 表示を確認）
- 毎回 `corepack yarn ...` と打つのが煩雑であれば `alias yarn='corepack yarn'` をシェル設定に追加しておく

## 2. 依存関係のインストール
- リポジトリ直下で `yarn bootstrap`
  - `git submodule update --init --recursive`
  - `yarn install`
  - `scripts/fix-dependencies.sh` によるパッチ適用（`@mapbox/tiny-sdf`, `react-virtualized`, `maplibregl-mapbox-request-transformer`）
- `cd examples/demo-app && yarn install`

## 3. 環境変数の設定
- ルートで `cp .env.template .env`
- 以下のキーに実値を投入
  - `MAPBOX_ACCESS_TOKEN`
  - `MAPBOX_EXPORT_TOKEN`
  - `DROPBOX_CLIENT_ID`
  - `CARTO_CLIENT_ID`
  - `FOURSQUARE_CLIENT_ID`
  - `FOURSQUARE_DOMAIN`
  - `FOURSQUARE_USER_MAPS_URL`
- `.env` は Git へコミットしない（既に `.gitignore` 済み）

## 4. ローカルビルド確認
- `cd examples/demo-app`
- `NODE_OPTIONS=--openssl-legacy-provider yarn start:local` で開発サーバー確認
- `NODE_OPTIONS=--openssl-legacy-provider yarn build`
- 成果物 `examples/demo-app/dist/` をブラウザでホストして動作確認

## 5. Netlify への手動デプロイ
- `npm install -g netlify-cli`
- `netlify login`
- `netlify init` でサイト作成（または既存サイトにリンク）
- Netlify 管理画面で Environment variables を設定（`MAPBOX_ACCESS_TOKEN` ほか）
- `examples/demo-app` で `netlify deploy --dir=dist`（プレビュー）
- 問題なければ `netlify deploy --dir=dist --prod`

## 6. 備考
- Node 18 + webpack 4 の組合せで OpenSSL 3 互換問題が生じるため、ビルド系コマンドには `NODE_OPTIONS=--openssl-legacy-provider` を明示。
- GPU 関連のネイティブ依存で `node-gyp` がビルドツールや Python を要求することがある。必要に応じて Xcode Command Line Tools と Python3 を用意。
- Netlify の自動ビルドは使用せず、ローカルビルド済み `dist` をアップロードする運用。
