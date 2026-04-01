# Admin テーマ設計ドキュメント

## 概要

このドキュメントは `apps/admin` における Material UI テーマの設計方針・実装手順をまとめたものです。
Figma デザインをもとに収集した仕様と、MUI テーマへの落とし込み方針を記載します。

---

## 技術スタック

| ライブラリ | バージョン | 用途 |
|---|---|---|
| `@mui/material` | v7 | UIコンポーネント・テーマ |
| `@emotion/react` | v11 | CSS-in-JS（MUI依存） |
| `@emotion/styled` | v11 | スタイル付きコンポーネント（MUI依存） |

---

## ファイル構成

```
src/
├── theme.ts          # テーマ定義（createTheme）
├── main.tsx          # ThemeProvider でアプリ全体を包む
└── components/
    └── ...           # テーマを利用するコンポーネント
```

---

## Figma デザイン仕様

### カラーパレット

#### ブランドカラー

| カラー名 | HEX | 用途 |
|---|---|---|
| Primary | `#5F6DC2` | 保存ボタン背景・サイドバー右ボーダー |
| Primary Dark | `#2F3C8C` | 基本テキスト・ボタンテキスト・パンくずリスト |
| Primary Light | `#4A5ABB` | アイコン |
| Surface | `#C9CEEA` | 外側カード背景 |
| Inner Surface | `#5B6DC6` | 内側カード背景 |
| White | `#FFFFFF` | ページ背景・強調テキスト |
| Black | `#000000` | 保存ボタンテキスト |

#### ステータスカラー

| カラー名 | HEX | 用途 |
|---|---|---|
| Error / Danger | `#D71212` | 警告ボタンのボーダー・テキスト色 |

> ℹ️ error / warning / success の全ステータスカラーはFigmaで未定義のため、MUI のデフォルト値をそのまま使用する。

#### 背景色

| MUI トークン | HEX | 用途 |
|---|---|---|
| `background.default` | `#FFFFFF` | ページ全体の背景 |
| `background.paper` | `#C9CEEA` | 外側カード背景 |
| — | `#5B6DC6` | 内側カード背景（MUIトークン外・個別指定） |

#### テキスト色

| 用途 | HEX |
|---|---|
| 基本テキスト（`text.primary`） | `#2F3C8C` |
| 保存ボタンテキスト | `#000000` |

---

### タイポグラフィ

- **フォント**: Noto Sans JP
- **フォントサイズ範囲**: 16px 〜 20px
- **ウェイト**: すべて Regular（400）

| スタイル | サイズ | ウェイト | 用途 |
|---|---|---|---|
| 見出し | 20px | Regular | ページタイトル等 |
| 本文 | 16px | Regular | サイドバーボタンのテキスト・パンくずリスト |

---

### 形状・スペース

| 項目 | 値 | 備考 |
|---|---|---|
| border-radius | `10px` | ボタン・カード共通 |
| spacing ベース単位 | `8px` | 4の倍数で運用 |
| カード padding | `8px` | 内側の余白 |

---

### コンポーネント仕様

#### ボタン

- **デフォルト**: アウトラインスタイル
- **重要操作時**: 塗りつぶしスタイル（保存のみ）
- **警告・削除**: アウトラインスタイル（赤系）

| 種別 | 背景色 | ボーダー色 | テキスト色 | 影 |
|---|---|---|---|---|
| アウトライン（通常） | `#EFF0F8` | `#7F8CD6` | `#2F3C8C` | あり |
| 塗りつぶし（保存） | `#5F6DC2` | — | `#000000` | あり |
| アウトライン（警告・削除） | `#D9DCED` | `#D71212` | `#D71212` | あり |

**ドロップシャドウ（全ボタン共通）**

| 項目 | 値 |
|---|---|
| X | `0px` |
| Y | `4px` |
| ぼかし（Blur） | `4px` |
| 広がり（Spread） | `0px` |
| 色・不透明度 | `rgba(0, 0, 0, 0.25)` |

CSS: `box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25)`

#### パンくずリスト（Breadcrumbs）

- 左上に現在地の階層を表示するナビゲーション
- 各項目はクリックで該当ページへ遷移できる
- **フォントサイズ**: 16px / Regular
- **テキスト色**: `#2F3C8C`
- **影**: なし
- MUI の `Breadcrumbs` + `Link` コンポーネントで実装

#### サイドバー

| 項目 | 値 |
|---|---|
| 幅 | `250px` |
| 背景色 | `#D9DCED` |
| 右ボーダー | `1px solid #5F6DC2` |
| ボタンテキスト | 16px / Regular / `#2F3C8C` |
| 選択中アイテム背景 | `#D6D6D6` |
| 選択中アイテムテキスト | 色変化なし・不透明度 30% |

#### カード

| 項目 | 値 |
|---|---|
| 影 | なし（flat） |
| 外側カード背景 | `#C9CEEA` |
| 内側カード背景 | `#5B6DC6` |
| 内側カードテキスト | `#2F3C8C` |
| padding | `8px` |

---

## テーマ実装

### `src/theme.ts`

```ts
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5F6DC2',
      dark: '#2F3C8C',
      light: '#4A5ABB',
    },
    error: {
      main: '#D71212',
    },
    text: {
      primary: '#2F3C8C',
    },
    background: {
      default: '#FFFFFF',
      paper: '#C9CEEA',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    h1: { fontSize: '20px', fontWeight: 400 },
    body1: { fontSize: '16px', fontWeight: 400 },
  },
  shape: {
    borderRadius: 10,
  },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
        outlined: {
          backgroundColor: '#EFF0F8',
          borderColor: '#7F8CD6',
          color: '#2F3C8C',
        },
        contained: {
          backgroundColor: '#5F6DC2',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#4A5ABB',
          },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          color: '#2F3C8C',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: 10,
          padding: 8,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 250,
          backgroundColor: '#D9DCED',
          borderRight: '1px solid #5F6DC2',
        },
      },
    },
  },
})

export default theme
```

### `src/main.tsx`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```

---

## 参考リンク

- [MUI Theming 公式ドキュメント](https://mui.com/material-ui/customization/theming/)
- [MUI Palette 公式ドキュメント](https://mui.com/material-ui/customization/palette/)
- [MUI Typography 公式ドキュメント](https://mui.com/material-ui/customization/typography/)
- [MUI Component Overrides](https://mui.com/material-ui/customization/theme-components/)
- [MUI Breadcrumbs](https://mui.com/material-ui/react-breadcrumbs/)
