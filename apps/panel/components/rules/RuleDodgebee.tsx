import {
    Box,
    Stack,
    Typography,
    DialogContentText,
    useTheme
} from "@mui/material";
import {RuleNumCard} from "./rule-elements/RuleNumCard";
import ReactMarkdown from "react-markdown";
import Coat from "@/src/assets/coat-dodgebee.svg?react"
import * as React from "react";

const markdown = `
### 📗ルール
- 必ず 1 試合中に 1 人 1 回はフリスビーに触れる。
- 基本的なドッジボールのルールに準ずるが、以下の点に注意する。
- ドッジビー用フリスビーを用いる。
- 最初に投げるチームを試合開始前にじゃんけんで決める。
- 試合開始前に各チームから元外野を 2 名決定する。
- 元外野は外野の人数が 1 人増えたら 1 人目が内野に戻り、もう 1 人増えたら 2 人目も戻ることとする。戻るタイミングを逃した場合は、元外野は内野に戻ることはできない。
- 試合終了時に内野に残っている人数の多いチームを勝利とする。
- 首から上のヒットは無効だが、審判が故意に首から上でボールを受けたと判断した場合は有効とする。
- 参加人数の多いチームに出場人数を合わせ、人数の少ないチームは 2 回当たってよい
> 選手を決めゼッケンを着用することとし、その選手は、1 回目のヒットでゼッケンを脱いで内野に留まり、2 回目のヒットで外野に移動する。
- 原則、2 回当たってよい選手は男子とするが、参加者に男子がいない場合は女子が 3回当たってもよいこととする。その際はゼッケンを 2 枚着用する。
- 元外野が最後まで外野に残る場合は、内野人数としてカウントすることができない。
- 縦投げを禁止とする。
- フリスビーを持ってから 15 秒以内に投げなければいけない。
- 試合開始から 5 分経過したら追加のフリスビーを、そのときフリスビーを持っていない方のチームに渡す。（審判が競技本部のアナウンスに応じて）
***
### ⚠️注意事項
- 審判の判定に従う。
`

export const RuleDodgebee = () => {
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
            <Typography color={theme.palette.text.primary}>フィールド図</Typography>
            <Stack
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={2}
                pb={2}
                sx={{width:"100%"}}
            >
                <Box sx={{width:"100%", maxWidth:"350px"}}>
                    <Coat width={"98%"} fill={theme.palette.text.primary}/>
                </Box>
            </Stack>
            <RuleNumCard title={"会場"} content={"寮前テニスコート"}/>
            <RuleNumCard title={"出場人数"} content={"6~8人"}/>
            <RuleNumCard title={"試合時間"} content={"9分"}/>
            <RuleNumCard title={"順位決定法"} content={"勝ち点制"} sub={"勝ち3点・引き分け1点・負け0点　として合計点で順位を決定し、勝ち点が同じ場合、残った内野の人数の合計で順位を決める。ただし、内野の人数を数えるとき、ゼッケンは含まれない。"}/>
            <RuleNumCard title={"女子ハンデ"} content={"2回目のヒットでアウト"} sub={"女子は試合開始前にゼッケンを着用することとし、2 回のヒットでアウトとなる。1 回目のヒットではゼッケンを脱いで内野に留まり、2 回目のヒットで外野へ移動する。ただし、外野から内野に戻った時はゼッケンを着ることはできない。女子のゼッケンは 1 チーム 4 枚までとする。"}/>
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