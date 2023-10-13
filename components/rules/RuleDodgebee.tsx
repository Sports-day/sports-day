import {
    Box,
    Grid,
    Stack,
    Typography,
    DialogContentText,
} from "@mui/material";
import {RuleNumCard} from "./rule-elements/RuleNumCard";
import ReactMarkdown from "react-markdown";
import Coat from "../../public/rules/coat-dodgebee.svg"
import * as React from "react";

const markdown = `
# 📗ルール
基本的なドッジボールのルールに準ずるが、以下の点に注意する。
- ドッジビー用フリスビーを用いる。
- 最初に投げるチームは試合開始前にじゃんけんで決める。
- 試合開始前に各チームから元外野を2名決定する。
- 元外野は外野の人数が1人増えたら1人目が内野に戻り、もう1人増えたら2人目も戻ることとする。戻るタイミングを逃した場合は、元外野は内野に戻れない。
- 試合終了時に内野に残っている人数の多いチームを勝利とする。
- 首から上のヒットは無効だが、審判が故意に首から上でボールを受けたと判断した場合は有効とする。
- 参加人数の多いチームに出場人数を合わせ、人数の少ないチームは2回当たってよい選手を決めゼッケンを着用することとし、その選手は、1回目のヒットでゼッケンを脱いで内野に留まり、2回目のヒットで外野に移動する。
- 原則、2回当たってよい選手は男子とするが、参加者に男子がいない場合は女子が3回当たってもよいこととする。その際はゼッケンを2枚着用する。
- 縦投げを禁止とする。
- フリスビーを持ってから15秒以内に投げなければいけない。
- 試合開始から5分経過したら追加のフリスビーを、そのときフリスビーを持っていない方のチームに渡す。（審判が競技本部のアナウンスに応じて）

# 🥇順位決定法
- 勝ち点制を採用し、勝ちを3点、引き分けを1点、負けを0点とし、合計点で順位を決定する。
- 勝ち点の同じ場合、残った内野の人数の合計で順位を決める。 ただし、内野の人数を数え
るとき、ゼッケンは含まれない。

# ⚠️注意事項
- 審判の判定に従う。
- 試合へ遅刻したり得点板係の仕事を怠ったりした場合は決勝進出不可等のペナルティを与える。
- リーグ内で勝ち点が同点の場合は合計点差で勝敗を決める。
`

export const RuleDodgebee = () => {
    return(
        <Stack
            direction={"column"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={2}
            py={2}
            sx={{width:"100%"}}
        >
            <Typography color={"#E8EBF8"}>フィールド図</Typography>
            <Stack
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={2}
                pb={2}
                sx={{width:"100%"}}
            >
                <Box sx={{width:"100%", maxWidth:"350px"}}>
                    <Coat width={"98%"} fill={'#99a5d6'}/>
                </Box>
            </Stack>
            <Grid container>
                <Grid xs={12} sm={12} lg={12}>
                    <RuleNumCard title={"会場"} content={"寮前テニスコート"} sub={" "}/>
                </Grid>
                <Grid xs={6} sm={6} lg={3}>
                    <RuleNumCard title={"試合時間"} content={"10分"} sub={"☀️☔️共通"}/>
                </Grid>
                <Grid xs={6} sm={6} lg={3}>
                    <RuleNumCard title={"出場人数"} content={"6 〜 8"} sub={"人"}/>
                </Grid>
                <Grid xs={12} sm={12} lg={6}>
                    <RuleNumCard title={"担当審判"} content={"指定審判"} sub={"リーグ表参照"}/>
                </Grid>
                <Grid xs={12} sm={12} lg={12}>
                    <RuleNumCard title={"女子ハンデ"} content={"2回当たってよい"} sub={"試合開始前に、１チーム最大３人がゼッケンを着用する(人数合わせ用ゼッケンはこの限りではない)。1回目のヒットでゼッケンを脱ぎ、2回目のヒットで外野へ移動する。内野に戻った時はゼッケンを着ることはできない。"}/>
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