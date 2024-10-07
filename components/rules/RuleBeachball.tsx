import {
    Stack,
    DialogContentText,
    useTheme
} from "@mui/material";
import {RuleNumCard} from "./rule-elements/RuleNumCard";
import ReactMarkdown from "react-markdown";
import * as React from "react";

const markdown = `
# 📗ルール
- 基本的にビーチバレーのルールに準ずるが、以下の点に注意すること。  
- 試合開始時のサーブ権はじゃんけんによって決める。  
- コートは第一体育館のバドミントンコートダブルスライン(外側)に従う。  
- ラインや得点に関しての指示は審判に従うこと。  
- ブロック等は行ってよい。  
- 試合出場者は4人とし、人数が4人を超えるときはローテーションをする。  
- サーブはコート右前の人が打つ。（アンダーサーブのみとする）  
- ボールに触れる回数は1回の攻撃で3回まで。  
- 相手コートに入れるか、タッチアウトで1点とする。  
- ラリーポイント制で行う。  \t同じ人が連続してボールに触れてはいけない。  
- ネットタッチ、オーバーネットは禁止とする。それらを行った場合、相手チームに1点の得点となる。  
- インまたはアウトの基準は、真上から見てボールがラインにかかっているかどうかで判断する。（判定は審判に従う）  
- デュースはなしとする。

# 🥇順位決定法
### ＜予選リーグ＞
- 予選リーグのみ勝ち点方式を採用する。
- 勝ち…2点　　引き分け…１点　　負け…０点
- 集計において同点となった場合には、直接対決の結果をもって勝敗を決める。
- 直接対決が同点の場合、各チームの代表者１名によるじゃんけんにより勝敗を決める。
 
### ＜決勝トーナメント＞
- 審判の判定に従う。
- 試合開始10分前には試合場所に集合する。



# ⚠️注意事項
- 審判の判定に従う。
- 次の試合が当たっているチームは第一体育館二階などで待機するようにすること。
`

export const RuleBeachball = () => {
    const theme = useTheme();
    return(
        <Stack
            direction={"column"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
            py={2}
            sx={{width:"100%"}}
        >
            <RuleNumCard title={"会場"} content={"第一体育館"}/>
            <RuleNumCard title={"試合時間"} content={"7分"}/>
            <RuleNumCard title={"部員ハンデ"} content={"女子バレー部　１点"}/>
            <RuleNumCard title={"女子ハンデ"} content={"女子得点　３点"}/>
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