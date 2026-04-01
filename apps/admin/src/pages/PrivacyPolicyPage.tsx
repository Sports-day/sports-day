import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

type Props = {
  onClose: () => void
}

const SECTION_TITLE_SX = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#2F3C8C',
  mb: 1.5,
  mt: 3,
}

const CARD_SX = {
  backgroundColor: '#E1E4F6',
  border: '1px solid #5B6DC6',
  borderRadius: 1,
  p: 1.5,
  mb: 1,
}

const CARD_TITLE_SX = {
  fontSize: '13px',
  fontWeight: 700,
  color: '#2F3C8C',
  mb: 0.5,
}

const CARD_BODY_SX = {
  fontSize: '13px',
  color: '#2F3C8C',
  lineHeight: 1.75,
}

const PLAIN_BODY_SX = {
  fontSize: '13px',
  color: '#2F3C8C',
  lineHeight: 1.75,
  mb: 1,
}

const ANIMATION_DURATION = 320

export default function PrivacyPolicyPage({ onClose }: Props) {
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      onClose()
    }, ANIMATION_DURATION)
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#E1E4F6',
        '@keyframes slideUp': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        '@keyframes slideDown': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
        animation: closing
          ? `slideDown ${ANIMATION_DURATION}ms ease-in forwards`
          : `slideUp ${ANIMATION_DURATION}ms ease-out`,
      }}
    >
      {/* ヘッダー */}
      <Box
        sx={{
          height: 44,
          background: 'linear-gradient(to right, #C0C6E9 0%, #CBD0EA 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <Box
          onClick={handleClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: '#2F3C8C',
            '&:hover': { opacity: 0.7 },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#2F3C8C' }}>閉じる</Typography>
        </Box>
      </Box>

      {/* コンテンツ */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, sm: 4, md: 8 }, py: 3 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>

          <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
            SPORTSDAYの個人情報取り扱い方針
          </Typography>

          {/* Section 1 */}
          <Typography sx={SECTION_TITLE_SX}>どのような情報を収集しますか？</Typography>
          <Typography sx={PLAIN_BODY_SX}>当サイトを利用すると、以下の情報が収集されることがあります。</Typography>

          <Box sx={CARD_SX}>
            <Typography sx={CARD_TITLE_SX}>基本的なアカウント情報</Typography>
            <Typography sx={CARD_BODY_SX}>
              当サイトを利用するためには、Microsoftアカウントの基本的な情報（名前・アイコン）を取得します。また、参加する競技やチーム・リーグ・トーナメント・得点状況といった大会進行にしたがって必要な情報は、SPORTSDAY Adminを用いて登録されます。これらの情報は他のSPORTSDAYユーザーに公開されます。
            </Typography>
          </Box>

          <Box sx={CARD_SX}>
            <Typography sx={CARD_TITLE_SX}>Cookie</Typography>
            <Typography sx={CARD_BODY_SX}>
              当サイトを利用すると、お使いのブラウザのCookieを利用します。CookieはSPORTSDAYの利用に伴う情報のみが保存・利用されます。Cookieが許可されていなければ、SPORTSDAYが正常に動作しない可能性があります。
            </Typography>
          </Box>

          <Box sx={CARD_SX}>
            <Typography sx={CARD_TITLE_SX}>その他のデータ</Typography>
            <Typography sx={CARD_BODY_SX}>
              アンケートや基本的な使用状況（アクセス数）は、SPORTSDAYの管理者（大会運営者）が閲覧することがあります。
            </Typography>
          </Box>

          {/* Section 2 */}
          <Typography sx={SECTION_TITLE_SX}>情報は何に使用されますか？</Typography>
          <Typography sx={PLAIN_BODY_SX}>収集した情報は次のように使用されることがあります。</Typography>

          <Box sx={CARD_SX}>
            <Typography sx={CARD_TITLE_SX}>SPORTSDAYのコア機能の提供</Typography>
            <Typography sx={CARD_BODY_SX}>
              基本的なアカウント情報は大会実施期間に限り、他のユーザーに競技一覧や進行状況として見ることで、大会の現況を把握することができるようにするために使用されます。また、大会運営者が大会前にリーグ・トーナメント・試合時間の調整を行う際や、大会進行時に競技の得点を入力する際に、ユーザーまたはチームを識別するために最低限の情報を表示することがあります。
            </Typography>
          </Box>

          <Box sx={CARD_SX}>
            <Typography sx={CARD_TITLE_SX}>ログイン状態の識別</Typography>
            <Typography sx={CARD_BODY_SX}>
              Cookieは、主にSPORTSDAYにログインしているかどうかを識別するために利用されます。
            </Typography>
          </Box>

          <Box sx={CARD_SX}>
            <Typography sx={CARD_TITLE_SX}>SPORTSDAYの改善</Typography>
            <Typography sx={CARD_BODY_SX}>
              当サイトでは、一部でアクセス解析ツールであるGoogle Analyticsを使用しており、そのためにCookieを利用することがあります。アンケートの回答結果やアクセス数などの情報は、SPORTSDAYの開発者や運営者が今後のシステム改善のためだけに閲覧することがあります。
            </Typography>
          </Box>

          {/* Section 3 */}
          <Typography sx={SECTION_TITLE_SX}>情報をどのように保護しますか？</Typography>
          <Typography sx={PLAIN_BODY_SX}>
            SPORTSDAY開発者は、ユーザーが入力・送信する際や自身の情報にアクセスする際に個人情報を安全に保つため、さまざまなセキュリティ上の対策を実施しています。アプリケーションとユーザーの間の通信はSSL/TLSによって保護されます。また、ログイン処理はOIDCを用いており、SPORTSDAY開発者はパスワードなどの情報を一切収集することができません。
          </Typography>

          {/* Section 4 */}
          <Typography sx={SECTION_TITLE_SX}>データの保持はどのように行われますか？</Typography>
          <Typography sx={PLAIN_BODY_SX}>
            SPORTSDAY開発者は誠意を持って次のように努めます：大会を通して収集されたアンケート結果以外のデータは、大会期間（大会当日の前後約1ヶ月）のみサーバーに保持されます。大会期間を過ぎると直ちに削除され、サーバーのストレージを完全にクリーンな状態にして安全に処理します。
          </Typography>

          {/* Section 5 */}
          <Typography sx={SECTION_TITLE_SX}>何らかの情報を外部に提供していますか？</Typography>
          <Typography sx={PLAIN_BODY_SX}>
            SPORTSDAY開発者は、個人を特定できるいかなる情報を外部へ提供・流出することはありません。ただし、アンケート結果から得られた評価など、実際の大会で得られたデータのうち個人の特定が不可能な情報のみをSPORTSDAYのプロモーションや発表のために利用する場合があります。
          </Typography>

          {/* Section 6 */}
          <Typography sx={SECTION_TITLE_SX}>プライバシーポリシーの変更について</Typography>
          <Typography sx={PLAIN_BODY_SX}>
            プライバシーポリシーの変更があった場合、このページに変更を掲載します。
          </Typography>

          {/* フッター */}
          <Box sx={{ mt: 4, mb: 2, pt: 2, borderTop: '1px solid #5B6DC6' }}>
            <Typography sx={{ fontSize: '12px', color: '#8490C8', mb: 0.5 }}>
              最終更新：2024年4月17日
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#8490C8' }}>(C)2026</Typography>
          </Box>

        </Box>
      </Box>
    </Box>
  )
}
