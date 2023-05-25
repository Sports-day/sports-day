import {
    Box,
    Grid,
    Stack,
    Typography,
    DialogContentText,
} from "@mui/material";
import {RuleNumCard} from "./rule-elements/RuleNumCard";
import ReactMarkdown from "react-markdown";
import * as React from "react";

const markdown = `
# 📗ルール
- 制限時間内に大小15枚のフリスビーを用いて18枚のパネルを何枚打ち抜けるか競う各クラスの1グループはさらにAとBにわかれる。
→1ゲームをAチーム、2ゲーム目をBチームが行う2ゲーム制とする。
- 先攻クラスAチーム→後攻クラスAチーム→先攻クラスBチーム→後攻クラスBチームの順で挑戦する。
- パネルまでの距離は5ｍとする。
→5ｍラインを越えてフリスビーを投げた場合、ペナルティとして獲得枚数を1枚減らす待ち時間は1チーム1分間とする。
- ひとつのゲーム内でチームメンバー全員が必ず投げることとする。

# 🥇採点方法
- 試合終了時の得点が多いチームが勝利とする
- 試合終了時に得点が同じ場合は、代表者のじゃんけんで勝敗を決める
- 勝ち点は、勝ち→3、引き分け→1、負け→0
- リーグ内で勝ち点が同点の場合は得失点差で勝敗を決める

# ⚠️注意事項
- 投げたフリスビーの回収は選手が行う
- 試合時間と終了後に消毒を徹底する。
- 試合終了後にフリスビーを消毒する。
`

export const RuleStrackout = () => {
    return(
        <Stack
            direction={"column"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={2}
            py={2}
            sx={{width:"100%"}}
        >
            <Typography color={"#E8EBF8"}>フィールド図はありません</Typography>
            <Grid container>
                <Grid xs={12} sm={12} lg={12}>
                    <RuleNumCard title={"会場"} content={"校舎と武道場の間"} sub={"️☀️晴天時"}/>
                </Grid>
                <Grid xs={12} sm={12} lg={12}>
                    <RuleNumCard title={"会場"} content={"オープンラボ１"} sub={"️☔️雨天時"}/>
                </Grid>
                <Grid xs={6} sm={6} lg={3}>
                    <RuleNumCard title={"試合時間"} content={"10分"} sub={"準備を含めて"}/>
                </Grid>
                <Grid xs={6} sm={6} lg={3}>
                    <RuleNumCard title={"チーム人数"} content={"6 〜 8"} sub={"人"}/>
                </Grid>
                <Grid xs={12} sm={12} lg={3}>
                    <RuleNumCard title={"担当審判"} content={"参加チーム"} sub={"1試合あたり1~2人"}/>
                </Grid>
                <Grid xs={12} sm={12} lg={6}>
                    <RuleNumCard title={"女子ハンデ"} content={"なし"} sub={""}/>
                </Grid>
            </Grid>
            <DialogContentText
                id="scroll-dialog-description"
                tabIndex={-1}
                color={"#E8EBF8"}
                lineHeight={"27px"}
            >
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </DialogContentText>
        </Stack>
    )
}