# SBTZ

### ディレクトリ構成

- frontend
  - SBTZ.app のフロントエンド
- thirdweb-contracts
  - スマートコントラクト関連

### ローカル開発環境

frontend ディレクトリに .env.local ファイルを作成

```
cd frontend
pnpm i
pnpm dev
```

localhost:3000

### 利用している外部サービス

- Thirdweb

  - コントラクトの開発とフロントエンドの SDK として利用
  - https://thirdweb.com/dashboard
  - NEXT_PUBLIC_THIRDWEB_CLIENT_ID と THIRDWEB_SECRET_KEY に設定

- Moralis API

  - NFT 一覧表示をするときの API
  - https://moralis.io/
  - NEXT_PUBLIC_MORALIS_API_KEY に設定

- Magic Link

  - Email ベースのウォレットサービス
  - https://magic.link/

- OpenZeppelin Defender

  - ユーザーに対してガス代を無料で mint できるようにするために paymaster として利用
  - https://www.openzeppelin.com/defender

- Infura
  - ENS の変更など、Provider として利用
  - https://www.infura.io/
  - NEXT_PUBLIC_INFURA_API_KEY に設定
