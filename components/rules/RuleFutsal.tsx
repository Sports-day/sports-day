import {
    Grid,
    Stack,
    DialogContentText,
    useTheme
} from "@mui/material";
import {RuleNumCard} from "./rule-elements/RuleNumCard";
import ReactMarkdown from "react-markdown";
import * as React from "react";

const markdown = `
# 女子ハンデ
- 女子が3人以上のチームが攻撃の回は３アウト交代とする
- 女子が本塁に帰ってきた場合は得点を2点とする
- 3回の空振り制限の対象外とする
- 女子が蹴ったボールをピッチャーが捕るのは禁止とする

# 📗ルール
基本的にフットサルのルールに準ずるが、以下の点に注意する。
- キックオフは各チームの代表者によるじゃんけんで決める。
- ゴールキーパーがボールをキャッチした際、またはゴールキックとなる際は全てフリースローで行う。
- ボールがタッチラインを割ったら、ボールが出たところからキックインを行う。
- ファウルはその場からのフリーキックとする。
- オフサイドなし。
- 通常のゴールは2点。
- 選手交代はボールがタッチラインを割ったときや、ファウルでプレーが中断したときのみする。

# 🥇順位決定法
- リーグに分かれて予選を行った後、 予選上位８チームで決勝トーナメントを行う。
リーグ戦では勝ち点制を採用し、 勝ちを３点、引き分けを1点、負けを0点とし、 合計で順位を決定する。

# ⚠️注意事項
- 審判の判定に従う。
- スパイクの使用は禁止する。
`

export const RuleFutsal = () => {
    const theme = useTheme();
    return(
        <Stack
            direction={"column"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={2}
            py={2}
            sx={{width:"100%"}}
        >
            <Grid container>
                <Grid xs={12} sm={12} lg={12}>
                    <RuleNumCard title={"会場"} content={"グラウンド"} sub={" "}/>
                </Grid>
                <Grid xs={6} sm={6} lg={3}>
                    <RuleNumCard title={"試合時間"} content={"8分"} sub={"-"}/>
                </Grid>
                <Grid xs={6} sm={6} lg={3}>
                    <RuleNumCard title={"出場人数"} content={"5 〜 8"} sub={"人"}/>
                </Grid>
                <Grid xs={12} sm={12} lg={6}>
                    <RuleNumCard title={"担当審判"} content={"サッカー部"} sub={"-"}/>
                </Grid>
                <Grid xs={12} sm={12} lg={6}>
                    <RuleNumCard title={"部員ハンデ"} content={"サッカー部員のゴールは１点"} sub={"部員はビブスを着用し、コート内2人まで"}/>
                </Grid>
                <Grid xs={12} sm={12} lg={6}>
                    <RuleNumCard title={"女子ハンデ"} content={"ゴール３点"} sub={"女子サッカー部員は２点"}/>
                </Grid>
            </Grid>
            <DialogContentText
                id="scroll-dialog-description"
                tabIndex={-1}
                color={theme.palette.text.primary}
                lineHeight={"27px"}
            >
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </DialogContentText>
        </Stack>
    )
}