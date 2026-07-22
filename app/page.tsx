"use client";

import { useMemo, useState } from "react";
import audioData from "./audio-data.json";

type Family = "元音" | "辅音";

type Phoneme = {
  id: string;
  symbol: string;
  family: Family;
  group: string;
  groupEn: string;
  anchor: string;
  anchorIpa: string;
  label: string;
  tip: string;
  traits: string[];
  words: Array<[string, string]>;
  phrases: string[];
  sentence: string;
  rule: string;
};

const P = (
  id: string,
  symbol: string,
  family: Family,
  group: string,
  groupEn: string,
  anchor: string,
  anchorIpa: string,
  label: string,
  tip: string,
  traits: string[],
  words: Array<[string, string]>,
  phrases: string[],
  sentence: string,
  rule: string,
): Phoneme => ({
  id,
  symbol,
  family,
  group,
  groupEn,
  anchor,
  anchorIpa,
  label,
  tip,
  traits,
  words,
  phrases,
  sentence,
  rule,
});

const phonemes: Phoneme[] = [
  P("i", "i", "元音", "前元音", "Front vowels", "see", "/si/", "长衣音", "嘴角向两侧拉开，舌前部抬高；声音清晰、持续，不要读成汉语“衣”。", ["舌位高", "嘴角展开", "紧元音"], [["see", "/si/"], ["need", "/nid/"], ["people", "/ˈpipəl/"]], ["green tea", "feel free"], "We need three clean seats.", "元音后接元音时可自然衔接：see‿it，中间不要停顿。"),
  P("ih", "ɪ", "元音", "前元音", "Front vowels", "sit", "/sɪt/", "短衣音", "嘴唇放松，舌位比 /i/ 稍低；短促收住，避免拉成长音。", ["舌位偏高", "嘴唇放松", "松元音"], [["sit", "/sɪt/"], ["little", "/ˈlɪtəl/"], ["busy", "/ˈbɪzi/"]], ["big city", "quick fix"], "This little gift is for him.", "非重读音节中的 /ɪ/ 常更轻，如 wanted 的末尾。"),
  P("eh", "ɛ", "元音", "前元音", "Front vowels", "bed", "/bɛd/ · /bed/", "短诶音", "下巴微降，舌前部在中间高度，声音短而松。美式词典多写 /ɛ/，部分英式体系写 /e/，这里并列保留。", ["舌位中", "嘴唇自然", "松元音"], [["bed", "/bɛd/"], ["friend", "/frɛnd/"], ["ready", "/ˈrɛdi/"]], ["best friend", "get ready"], "Ben left ten red pens.", "在 get it 中，/t/ 常闪音化，听起来接近 get‿it。"),
  P("ae", "æ", "元音", "前元音", "Front vowels", "cat", "/kæt/", "大口梅花音", "嘴张大、下巴放低，舌尖抵下齿；从喉咙前部发出饱满的音。", ["舌位低", "嘴巴张大", "松元音"], [["cat", "/kæt/"], ["happy", "/ˈhæpi/"], ["answer", "/ˈænsər/"]], ["black bag", "happy family"], "That black cat sat by the lamp.", "美音中 /æ/ 在鼻音前常略抬高，如 man、answer。"),

  P("uh", "ʌ", "元音", "中元音", "Central vowels", "cup", "/kʌp/", "短阿音", "嘴巴自然微张，舌头平放在中央；短促有力，不要发成圆唇音。", ["舌位中央", "短音", "重读"], [["cup", "/kʌp/"], ["love", "/lʌv/"], ["money", "/ˈmʌni/"]], ["much fun", "lunch money"], "My brother loves sunny Sundays.", "功能词重读时可出现 /ʌ/；非重读时通常弱化为 /ə/。"),
  P("schwa", "ə", "元音", "中元音", "Central vowels", "about", "/əˈbaʊt/", "弱读央元音", "所有肌肉都放松，轻轻带过；它几乎只出现在非重读音节。", ["中央音", "最短最轻", "非重读"], [["about", "/əˈbaʊt/"], ["banana", "/bəˈnænə/"], ["support", "/səˈpɔrt/"]], ["a cup of tea", "at the station"], "I can meet you at about eleven.", "连贯语流的核心是弱化：to /tə/、for /fər/、and /ən/。"),
  P("er", "ɝ", "元音", "中元音", "Central vowels", "bird", "/bɝd/", "重读卷舌音", "舌尖不上翘碰顶，舌身后缩并收紧；从元音开始就保持美式 r 色彩。", ["重读", "卷舌化", "舌身后缩"], [["bird", "/bɝd/"], ["first", "/fɝst/"], ["learn", "/lɝn/"]], ["first person", "learn German"], "The early bird learns first.", "美式英语保留词尾 r：first、work、learn 都要有清晰 r 色彩。"),
  P("unstressed-er", "ɚ", "元音", "中元音", "Central vowels", "teacher", "/ˈtitʃɚ/", "弱读卷舌音", "保持轻、短、卷舌；常见于词尾 -er、-or。", ["非重读", "卷舌化", "轻短"], [["teacher", "/ˈtitʃɚ/"], ["doctor", "/ˈdɑktɚ/"], ["better", "/ˈbɛtɚ/"]], ["better answer", "our teacher"], "Her younger brother is a doctor.", "词尾 /tɚ/ 常带闪音：better、water 的 t 接近快速的 d。"),

  P("u", "u", "元音", "后元音", "Back vowels", "blue", "/blu/", "长乌音", "双唇收圆并向前，舌后部抬高；声音持续稳定。", ["舌位高", "圆唇", "紧元音"], [["blue", "/blu/"], ["food", "/fud/"], ["school", "/skul/"]], ["blue moon", "good food"], "Sue brought blue shoes to school.", "在 do it 中可出现轻微 /w/ 滑音：do‿it。"),
  P("book", "ʊ", "元音", "后元音", "Back vowels", "book", "/bʊk/", "短乌音", "双唇略圆但放松，舌后部抬起较低；短促结束。", ["舌位偏高", "轻圆唇", "松元音"], [["book", "/bʊk/"], ["good", "/gʊd/"], ["woman", "/ˈwʊmən/"]], ["good book", "full look"], "The good cook took the book.", "good‿idea 中两个元音之间可自然带出轻微 /w/。"),
  P("aw", "ɔ", "元音", "后元音", "Back vowels", "call", "/kɔl/", "圆唇奥音", "嘴唇圆、下巴微降，舌后部略抬；注意不同美音口音可能与 /ɑ/ 合并。", ["中低舌位", "圆唇", "口音有差异"], [["call", "/kɔl/"], ["talk", "/tɔk/"], ["small", "/smɔl/"]], ["small talk", "long walk"], "Paul called after a long walk.", "部分美式口音中 cot 与 caught 同音，这是正常口音差异。"),
  P("ah", "ɑ", "元音", "后元音", "Back vowels", "hot", "/hɑt/", "大口啊音", "下巴下降，嘴唇不圆，舌后部放低；声音来自口腔后部。", ["舌位低", "不圆唇", "开口音"], [["hot", "/hɑt/"], ["job", "/dʒɑb/"], ["father", "/ˈfɑðɚ/"]], ["hot coffee", "hard job"], "Tom got a hot coffee at the shop.", "美音中字母 o 常读 /ɑ/：hot、job、coffee。"),

  P("ay", "eɪ", "元音", "双元音", "Diphthongs", "day", "/deɪ/", "诶滑音", "从 /e/ 向 /ɪ/ 滑动，前半段更长；不要拆成两个独立音。", ["前向滑动", "开到合", "重心在前"], [["day", "/deɪ/"], ["make", "/meɪk/"], ["train", "/treɪn/"]], ["great day", "take a break"], "Jane takes the train every day.", "say‿it 中 /eɪ/ 后可直接滑向下一个元音。"),
  P("eye", "aɪ", "元音", "双元音", "Diphthongs", "time", "/taɪm/", "爱滑音", "从张口的 /a/ 向较高的 /ɪ/ 滑动，下巴明显上收。", ["低到高", "嘴形收窄", "重心在前"], [["time", "/taɪm/"], ["right", "/raɪt/"], ["idea", "/aɪˈdiə/"]], ["right time", "bright idea"], "I might arrive by five.", "my‿idea 中可直接连读，保持滑音完整。"),
  P("oy", "ɔɪ", "元音", "双元音", "Diphthongs", "boy", "/bɔɪ/", "奥衣滑音", "先圆唇发 /ɔ/，再快速展开滑向 /ɪ/。", ["圆到展", "后到前", "重心在前"], [["boy", "/bɔɪ/"], ["voice", "/vɔɪs/"], ["enjoy", "/ɛnˈdʒɔɪ/"]], ["loud voice", "enjoy the noise"], "The boy enjoys his new toy.", "enjoy‿it 中双元音末尾顺势连接下一个元音。"),
  P("oh", "oʊ", "元音", "双元音", "Diphthongs", "go", "/goʊ/", "欧滑音", "从中后部元音滑向 /ʊ/，嘴唇逐渐收圆；美音滑动清晰。", ["后向滑动", "逐渐圆唇", "紧元音"], [["go", "/goʊ/"], ["home", "/hoʊm/"], ["open", "/ˈoʊpən/"]], ["go home", "open road"], "Joe drove home on the old road.", "go‿out 中常自然出现轻微 /w/ 过渡。"),
  P("ow", "aʊ", "元音", "双元音", "Diphthongs", "now", "/naʊ/", "啊乌滑音", "从开口 /a/ 滑向圆唇 /ʊ/，下巴上收、双唇渐圆。", ["低到高", "展到圆", "重心在前"], [["now", "/naʊ/"], ["house", "/haʊs/"], ["about", "/əˈbaʊt/"]], ["right now", "around town"], "How about going out now?", "how‿are 中 /aʊ/ 直接连接后面的元音，不另加停顿。"),

  P("p", "p", "辅音", "爆破音", "Stops", "pen", "/pɛn/", "清双唇爆破", "双唇闭紧后突然放气；词首要送气，声带不振动。", ["清辅音", "双唇音", "送气"], [["pen", "/pɛn/"], ["paper", "/ˈpeɪpɚ/"], ["stop", "/stɑp/"]], ["paper plane", "stop please"], "Please put the paper in the pink bag.", "词尾 /p/ 常不完全爆破：stop talking，闭唇但不必大力放气。"),
  P("b", "b", "辅音", "爆破音", "Stops", "book", "/bʊk/", "浊双唇爆破", "双唇闭紧，声带先振动再放开；出气比 /p/ 弱。", ["浊辅音", "双唇音", "弱送气"], [["book", "/bʊk/"], ["baby", "/ˈbeɪbi/"], ["job", "/dʒɑb/"]], ["big bag", "blue book"], "Bob bought a big blue bag.", "词尾 /b/ 后接辅音时常只保留闭唇动作：big bag。"),
  P("t", "t", "辅音", "爆破音", "Stops", "tea", "/ti/", "清齿龈爆破", "舌尖抵上齿龈后弹开；词首送气，美音中位置不同会有多种变化。", ["清辅音", "齿龈音", "强送气"], [["tea", "/ti/"], ["today", "/təˈdeɪ/"], ["water", "/ˈwɔtɚ/"]], ["take time", "get it"], "Tom takes the train to town.", "两元音之间的 t 常闪音化 /ɾ/：water、better、get‿it。"),
  P("d", "d", "辅音", "爆破音", "Stops", "day", "/deɪ/", "浊齿龈爆破", "舌尖抵上齿龈，声带振动后轻轻弹开。", ["浊辅音", "齿龈音", "弱送气"], [["day", "/deɪ/"], ["dinner", "/ˈdɪnɚ/"], ["good", "/gʊd/"]], ["good day", "did it"], "David did the dishes after dinner.", "两元音之间的 d 也可闪音化：did‿it，动作快速轻弹。"),
  P("k", "k", "辅音", "爆破音", "Stops", "key", "/ki/", "清软腭爆破", "舌后部抵软腭后迅速放开；词首有明显送气。", ["清辅音", "软腭音", "送气"], [["key", "/ki/"], ["coffee", "/ˈkɔfi/"], ["back", "/bæk/"]], ["cold coffee", "black cat"], "Kate keeps the key in her coat.", "词尾 /k/ 后接辅音常不完全爆破：black coffee。"),
  P("g", "g", "辅音", "爆破音", "Stops", "go", "/goʊ/", "浊软腭爆破", "舌后部抵软腭，声带振动后放开；不要在结尾加额外元音。", ["浊辅音", "软腭音", "弱送气"], [["go", "/goʊ/"], ["give", "/gɪv/"], ["bag", "/bæg/"]], ["good game", "big goal"], "Gary gave me a green bag.", "good game 中前一个 /d/ 可弱化，/g/ 清楚保留。"),

  P("f", "f", "辅音", "摩擦音", "Fricatives", "fine", "/faɪn/", "清唇齿摩擦", "上齿轻触下唇，让气流持续摩擦；声带不振动。", ["清辅音", "唇齿音", "可持续"], [["fine", "/faɪn/"], ["coffee", "/ˈkɔfi/"], ["life", "/laɪf/"]], ["feel fine", "fresh food"], "Fred found five fresh flowers.", "of 通常读 /əv/，不要受拼写影响读成 /f/。"),
  P("v", "v", "辅音", "摩擦音", "Fricatives", "voice", "/vɔɪs/", "浊唇齿摩擦", "位置与 /f/ 相同，同时让声带持续振动。", ["浊辅音", "唇齿音", "可持续"], [["voice", "/vɔɪs/"], ["very", "/ˈvɛri/"], ["love", "/lʌv/"]], ["very vivid", "love music"], "Vera has a very lively voice.", "have‿a 中 /v/ 直接连接后面的元音。"),
  P("theta", "θ", "辅音", "摩擦音", "Fricatives", "think", "/θɪŋk/", "清咬舌音", "舌尖轻放上下齿之间，让气流从缝隙通过；不要读成 /s/。", ["清辅音", "齿音", "舌尖可见"], [["think", "/θɪŋk/"], ["three", "/θri/"], ["both", "/boʊθ/"]], ["three things", "think through"], "I think three of them are free.", "three‿of 中 /θ/ 后直接连接元音，舌尖快速回收。"),
  P("eth", "ð", "辅音", "摩擦音", "Fricatives", "this", "/ðɪs/", "浊咬舌音", "舌位与 /θ/ 相同，但声带振动；常见于功能词。", ["浊辅音", "齿音", "声带振动"], [["this", "/ðɪs/"], ["mother", "/ˈmʌðɚ/"], ["breathe", "/brið/"]], ["this one", "the other"], "This is the other brother.", "the、this、that 在语流中要短而顺，不要把 /ð/ 读得过重。"),
  P("s", "s", "辅音", "摩擦音", "Fricatives", "see", "/si/", "清齿龈摩擦", "舌尖靠近齿龈但不接触，气流从中央窄缝通过。", ["清辅音", "齿龈音", "可持续"], [["see", "/si/"], ["city", "/ˈsɪti/"], ["rice", "/raɪs/"]], ["see soon", "nice city"], "Sue sees six small signs.", "复数词尾在清辅音后读 /s/：books、cats。"),
  P("z", "z", "辅音", "摩擦音", "Fricatives", "zoo", "/zu/", "浊齿龈摩擦", "舌位与 /s/ 相同，让声带振动；保持连续嗡鸣。", ["浊辅音", "齿龈音", "可持续"], [["zoo", "/zu/"], ["easy", "/ˈizi/"], ["music", "/ˈmjuzɪk/"]], ["easy music", "busy days"], "Zoe listens to jazz on busy days.", "复数词尾在元音或浊辅音后多读 /z/：days、bags。"),
  P("sh", "ʃ", "辅音", "摩擦音", "Fricatives", "she", "/ʃi/", "清邮音", "双唇微噘，舌面靠近硬腭，气流较宽地摩擦出去。", ["清辅音", "后齿龈音", "圆唇"], [["she", "/ʃi/"], ["shop", "/ʃɑp/"], ["nation", "/ˈneɪʃən/"]], ["shoe shop", "short show"], "She showed us six shiny shoes.", "did you 在快语中常同化为 /dɪdʒu/，与 /ʃ/、/ʒ/ 同属后齿龈区域。"),
  P("zh", "ʒ", "辅音", "摩擦音", "Fricatives", "vision", "/ˈvɪʒən/", "浊日音", "口型与 /ʃ/ 相同，同时声带振动；英语中较少出现在词首。", ["浊辅音", "后齿龈音", "声带振动"], [["vision", "/ˈvɪʒən/"], ["usual", "/ˈjuʒuəl/"], ["measure", "/ˈmɛʒɚ/"]], ["usual measure", "visual pleasure"], "It is usually a pleasure to visit.", "元音之间保持 /ʒ/ 的连续振动，不要读成 /dʒ/。"),
  P("h", "h", "辅音", "摩擦音", "Fricatives", "home", "/hoʊm/", "清喉音", "声门打开，像轻轻哈气；口型由后面的元音决定。", ["清辅音", "声门音", "弱摩擦"], [["home", "/hoʊm/"], ["happy", "/ˈhæpi/"], ["behind", "/bɪˈhaɪnd/"]], ["happy home", "help him"], "He hurried home behind her.", "him、her 等代词非重读时 h 常弱化甚至省略：tell‿him。"),

  P("ch", "tʃ", "辅音", "破擦音", "Affricates", "chair", "/tʃɛr/", "清破擦音", "先用 /t/ 阻断气流，再立刻释放成 /ʃ/；两个动作合成一个音。", ["清辅音", "后齿龈音", "先爆破后摩擦"], [["chair", "/tʃɛr/"], ["teacher", "/ˈtitʃɚ/"], ["watch", "/wɑtʃ/"]], ["cheap chair", "watch closely"], "The teacher chose a cheap chair.", "词尾 /tʃ/ 后不要加“呃”：watch it 要直接连到 /ɪ/。"),
  P("j", "dʒ", "辅音", "破擦音", "Affricates", "job", "/dʒɑb/", "浊破擦音", "先用 /d/ 阻断，再释放成带振动的 /ʒ/；保持一个完整音。", ["浊辅音", "后齿龈音", "声带振动"], [["job", "/dʒɑb/"], ["enjoy", "/ɛnˈdʒɔɪ/"], ["orange", "/ˈɔrɪndʒ/"]], ["good job", "orange juice"], "Jane enjoys her new job.", "would you 常同化为 /wʊdʒu/，听起来含有 /dʒ/。"),

  P("m", "m", "辅音", "鼻音", "Nasals", "man", "/mæn/", "双唇鼻音", "双唇闭合，让声音从鼻腔出去；声带持续振动。", ["浊辅音", "双唇音", "鼻腔共鸣"], [["man", "/mæn/"], ["summer", "/ˈsʌmɚ/"], ["time", "/taɪm/"]], ["more money", "summer morning"], "My mom makes muffins every morning.", "I’m‿a 中 /m/ 保持闭唇后直接连接元音。"),
  P("n", "n", "辅音", "鼻音", "Nasals", "nice", "/naɪs/", "齿龈鼻音", "舌尖抵上齿龈，气流从鼻腔通过；声带振动。", ["浊辅音", "齿龈音", "鼻腔共鸣"], [["nice", "/naɪs/"], ["dinner", "/ˈdɪnɚ/"], ["ten", "/tɛn/"]], ["nice night", "ten names"], "Nina needs nine new notebooks.", "n 后接 /t/、/d/ 时舌位相同，可保持舌尖位置快速衔接。"),
  P("ng", "ŋ", "辅音", "鼻音", "Nasals", "sing", "/sɪŋ/", "软腭鼻音", "舌后部抵软腭，声音从鼻腔出去；词尾不要额外加 /g/。", ["浊辅音", "软腭音", "鼻腔共鸣"], [["sing", "/sɪŋ/"], ["English", "/ˈɪŋglɪʃ/"], ["morning", "/ˈmɔrnɪŋ/"]], ["sing along", "spring morning"], "We sing English songs every morning.", "sing it 中 /ŋ/ 后直接连接元音；只有拼写或词形需要时才出现 /g/。"),

  P("l", "l", "辅音", "近音", "Approximants", "light", "/laɪt/", "舌侧音", "舌尖抵齿龈，气流从舌头两侧通过；词尾是更暗的 dark L。", ["浊辅音", "舌侧音", "明暗两种"], [["light", "/laɪt/"], ["little", "/ˈlɪtəl/"], ["feel", "/fil/"]], ["little light", "feel lucky"], "Lily left a little blue light on.", "词尾 dark L 舌后部抬起：feel、people，不要在后面加元音。"),
  P("r", "r", "辅音", "近音", "Approximants", "red", "/rɛd/", "美式卷舌近音", "舌尖抬起但不碰上腭，舌身后缩；双唇可稍圆。", ["浊辅音", "舌不接触", "美式 r"], [["red", "/rɛd/"], ["right", "/raɪt/"], ["around", "/əˈraʊnd/"]], ["red rose", "right around"], "Ryan ran around the red room.", "美音的词尾 r 必须读出：car、teacher、more。"),
  P("y", "j", "辅音", "近音", "Approximants", "yes", "/jɛs/", "半元音耶", "舌前部快速接近硬腭，再滑向后面的元音；不要停留太久。", ["浊辅音", "硬腭音", "快速滑动"], [["yes", "/jɛs/"], ["use", "/juz/"], ["music", "/ˈmjuzɪk/"]], ["young year", "use your"], "Yes, you can use your yellow bag.", "元音之间也会自然出现 /j/ 过渡：he‿is、I‿agree（依口型而定）。"),
  P("w", "w", "辅音", "近音", "Approximants", "we", "/wi/", "圆唇半元音", "双唇收圆，舌后部抬起，再迅速滑向后面的元音。", ["浊辅音", "圆唇", "快速滑动"], [["we", "/wi/"], ["water", "/ˈwɔtɚ/"], ["away", "/əˈweɪ/"]], ["warm water", "we will"], "We walked away in warm weather.", "do‿it、go‿out 之间常出现轻微 /w/ 过渡。"),
];

const order = ["前元音", "中元音", "后元音", "双元音", "爆破音", "摩擦音", "破擦音", "鼻音", "近音"];

const nativeAudio = audioData.available as Record<string, string>;
const phonemeAudio = Object.fromEntries(phonemes.map((item) => [item.id, `/audio/phonemes/${item.id}.wav?v=clarity-2`])) as Record<string, string>;
const phonemeNotation = (item: Phoneme) => item.id === "eh" ? `/${item.symbol}/ · /e/` : `/${item.symbol}/`;

let currentAudio: HTMLAudioElement | null = null;

const contrasts: Record<string, [string, string, string]> = {
  i: ["sheep", "ship", "/i/ 拉长、嘴角更展开；/ɪ/ 更短、更松"],
  ih: ["ship", "sheep", "/ɪ/ 短而松；/i/ 高而紧"],
  eh: ["bed", "bad", "/ɛ/ 下巴较高；/æ/ 开口更大"],
  ae: ["bad", "bed", "/æ/ 开口更大、舌位更低"],
  uh: ["luck", "lock", "/ʌ/ 在中央；/ɑ/ 更靠后、开口更大"],
  schwa: ["about", "cup", "/ə/ 无重音且更短；/ʌ/ 有重音"],
  er: ["bird", "bed", "从发音开始就保持美式 r 色彩"],
  "unstressed-er": ["teacher", "tea", "词尾 /ɚ/ 要轻、短，但仍有 r 色彩"],
  u: ["fool", "full", "/u/ 更长更紧；/ʊ/ 更短更松"],
  book: ["full", "fool", "/ʊ/ 嘴唇放松；/u/ 收得更圆"],
  aw: ["caught", "cot", "是否区分这两个音取决于美式口音区域"],
  ah: ["cot", "caught", "/ɑ/ 不圆唇；/ɔ/ 通常更圆"],
  ay: ["late", "let", "/eɪ/ 必须有滑动；/ɛ/ 是短单元音"],
  eye: ["bite", "bit", "/aɪ/ 从大开口滑向 /ɪ/"],
  oy: ["boy", "bow", "/ɔɪ/ 末尾向前展开；/oʊ/ 末尾收圆"],
  oh: ["coat", "caught", "/oʊ/ 有明显滑动；/ɔ/ 相对稳定"],
  ow: ["cow", "coat", "/aʊ/ 从开口开始；/oʊ/ 从圆唇开始"],
  p: ["pat", "bat", "/p/ 送气且不振动；/b/ 振动、出气弱"],
  b: ["bat", "pat", "/b/ 声带振动；/p/ 词首明显送气"],
  t: ["tie", "die", "/t/ 送气且不振动；/d/ 振动"],
  d: ["die", "tie", "/d/ 声带先振动；/t/ 有送气"],
  k: ["coat", "goat", "/k/ 送气；/g/ 声带振动"],
  g: ["goat", "coat", "/g/ 声带振动；/k/ 送气"],
  f: ["fan", "van", "/f/ 只有气流；/v/ 同时振动"],
  v: ["van", "fan", "/v/ 上齿下唇位置不变，加入振动"],
  theta: ["thigh", "thy", "/θ/ 不振动；/ð/ 要振动"],
  eth: ["thy", "thigh", "/ð/ 保持咬舌位置并让声带振动"],
  s: ["sip", "zip", "/s/ 不振动；/z/ 有连续嗡鸣"],
  z: ["zip", "sip", "/z/ 有嗡鸣；/s/ 只有气流"],
  sh: ["pressure", "pleasure", "/ʃ/ 不振动；/ʒ/ 振动"],
  zh: ["pleasure", "pressure", "/ʒ/ 保持连续振动，不要爆破"],
  h: ["heat", "eat", "/h/ 开头有一股轻气流"],
  ch: ["cheap", "jeep", "/tʃ/ 不振动；/dʒ/ 振动"],
  j: ["jeep", "cheap", "/dʒ/ 声带振动；/tʃ/ 不振动"],
  m: ["sum", "sun", "/m/ 双唇闭合；/n/ 舌尖抵齿龈"],
  n: ["sin", "sing", "/n/ 舌尖用力；/ŋ/ 舌后部用力"],
  ng: ["sing", "sin", "/ŋ/ 舌后部抵软腭，结尾不要加 /g/"],
  l: ["light", "right", "/l/ 舌尖接触齿龈；/r/ 完全不接触"],
  r: ["right", "light", "/r/ 舌尖不碰上腭；/l/ 必须接触"],
  y: ["year", "wear", "/j/ 舌前部抬高；/w/ 双唇先收圆"],
  w: ["wear", "year", "/w/ 双唇先收圆；/j/ 嘴唇不圆"],
};

const extraWords: Record<string, string[]> = {
  i: ["green", "three", "speak", "easy", "receive", "meet", "week"],
  ih: ["give", "six", "live", "fish", "pick", "minute", "business"],
  eh: ["get", "ten", "next", "help", "every", "many", "said"],
  ae: ["black", "back", "family", "last", "answer", "plan", "travel"],
  uh: ["run", "come", "under", "number", "enough", "young", "country"],
  schwa: ["away", "again", "today", "police", "problem", "around", "alone"],
  er: ["word", "work", "world", "girl", "turn", "service", "person"],
  "unstressed-er": ["water", "better", "sister", "brother", "answer", "number", "color"],
  u: ["do", "you", "new", "move", "two", "true", "room"],
  book: ["put", "look", "could", "would", "should", "foot", "sugar"],
  aw: ["law", "saw", "daughter", "bought", "morning", "four", "more"],
  ah: ["not", "on", "stop", "watch", "father", "car", "far"],
  ay: ["name", "place", "wait", "same", "change", "late", "great"],
  eye: ["my", "five", "find", "like", "high", "night", "idea"],
  oy: ["choice", "point", "noise", "join", "avoid", "enjoy", "toy"],
  oh: ["no", "know", "old", "road", "show", "phone", "slow"],
  ow: ["how", "out", "house", "town", "sound", "down", "around"],
  p: ["people", "place", "please", "open", "happy", "help", "map"],
  b: ["big", "bag", "baby", "about", "number", "job", "club"],
  t: ["take", "ten", "today", "time", "better", "water", "light"],
  d: ["do", "down", "dinner", "idea", "ready", "good", "need"],
  k: ["cat", "coffee", "kind", "come", "take", "back", "work"],
  g: ["good", "green", "again", "give", "big", "bag", "dog"],
  f: ["food", "family", "four", "friend", "after", "life", "laugh"],
  v: ["very", "visit", "every", "give", "have", "move", "five"],
  theta: ["three", "thing", "thank", "through", "both", "month", "healthy"],
  eth: ["that", "these", "those", "there", "other", "father", "together"],
  s: ["say", "six", "city", "sister", "bus", "class", "place"],
  z: ["zero", "busy", "days", "please", "use", "easy", "always"],
  sh: ["show", "short", "sure", "fish", "special", "English", "finish"],
  zh: ["usual", "measure", "pleasure", "television", "decision", "beige", "massage"],
  h: ["help", "happy", "here", "how", "ahead", "perhaps", "behind"],
  ch: ["choose", "child", "change", "lunch", "much", "each", "picture"],
  j: ["just", "join", "large", "page", "age", "juice", "bridge"],
  m: ["me", "more", "money", "morning", "time", "family", "room"],
  n: ["no", "new", "name", "night", "dinner", "ten", "open"],
  ng: ["song", "long", "thing", "young", "bring", "running", "language"],
  l: ["like", "love", "little", "long", "people", "feel", "call"],
  r: ["right", "room", "around", "really", "friend", "car", "more"],
  y: ["you", "young", "year", "yellow", "beautiful", "few", "music"],
  w: ["water", "want", "work", "way", "always", "away", "one"],
};

const extraPhrases: Record<string, string[]> = {
  i: ["see you", "need help", "three weeks", "speak English", "easy to read", "green leaves", "meet me", "please repeat"],
  ih: ["give it", "six minutes", "live with", "big difference", "pick this", "a little bit", "quick visit", "finish it"],
  eh: ["get ready", "ten minutes", "next step", "help me", "every day", "many people", "said yes", "check again"],
  ae: ["black bag", "come back", "happy family", "last chance", "answer that", "make a plan", "travel map", "at last"],
  uh: ["come up", "under pressure", "phone number", "enough time", "young man", "another one", "love it", "much better"],
  schwa: ["about a minute", "away from home", "again and again", "today at noon", "around the world", "a problem", "alone at home", "support a friend"],
  er: ["first word", "hard work", "whole world", "little girl", "turn left", "customer service", "in person", "learn more"],
  "unstressed-er": ["cold water", "older sister", "younger brother", "phone number", "favorite color", "after dinner", "better later", "answer her"],
  u: ["do you", "new shoes", "move through", "two rooms", "true story", "school uniform", "see you soon", "blue room"],
  book: ["put it", "could you", "would like", "should be", "left foot", "brown sugar", "take a look", "good woman"],
  aw: ["call me", "morning coffee", "four more", "saw it", "law school", "bought all", "small dog", "walk home"],
  ah: ["not now", "stop by", "watch out", "my father", "new car", "far away", "on top", "coffee shop"],
  ay: ["wait here", "same place", "change lanes", "say my name", "late today", "make way", "great idea", "take the train"],
  eye: ["my life", "five times", "find out", "like it", "high price", "good night", "right side", "bright light"],
  oy: ["good choice", "main point", "join us", "avoid it", "toy store", "voice message", "enjoy life", "boys and girls"],
  oh: ["no problem", "I know", "old phone", "show me", "drive slow", "close the door", "go alone", "open the window"],
  ow: ["how about", "go out", "new house", "sound good", "sit down", "look around", "downtown", "out of town"],
  p: ["people say", "right place", "please help", "open up", "happy people", "paper cup", "pick a place", "stop here"],
  b: ["big bag", "baby boy", "about time", "phone number", "good job", "book club", "back home", "blue bike"],
  t: ["take time", "ten times", "today too", "better late", "cold water", "turn right", "at the top", "tell them"],
  d: ["do it", "sit down", "after dinner", "good idea", "get ready", "good day", "need it", "day by day"],
  k: ["black cat", "cold coffee", "kind of", "come back", "take care", "at work", "keep calm", "quick call"],
  g: ["good game", "green bag", "go again", "give back", "big dog", "good girl", "get going", "great gift"],
  f: ["fresh food", "family friend", "four feet", "after five", "full life", "feel free", "for fun", "first floor"],
  v: ["very well", "visit every day", "give it", "have five", "move over", "love it", "evening view", "voice message"],
  theta: ["three things", "thank them", "think through", "both sides", "next month", "healthy food", "Thursday morning", "nothing else"],
  eth: ["that one", "these days", "those people", "over there", "the other", "with her", "together again", "this time"],
  s: ["say so", "six seats", "city center", "my sister", "last bus", "English class", "same place", "see you"],
  z: ["zero degrees", "busy days", "please use", "easy answer", "always does", "music class", "his eyes", "these shoes"],
  sh: ["short show", "shoe shop", "show me", "fish shop", "special dish", "English teacher", "finish soon", "she should"],
  zh: ["usual measure", "pure pleasure", "watch television", "final decision", "beige jacket", "gentle massage", "visual image", "usual version"],
  h: ["help him", "happy home", "here he is", "how high", "go ahead", "perhaps he will", "behind her", "hold on"],
  ch: ["cheap chair", "choose one", "young child", "change much", "lunch break", "each chance", "take a picture", "watch closely"],
  j: ["good job", "join us", "large juice", "front page", "at this age", "orange juice", "old bridge", "just joking"],
  m: ["more money", "summer morning", "meet me", "my mom", "family time", "make room", "some more", "Monday morning"],
  n: ["nice night", "ten names", "no news", "new name", "after dinner", "open now", "on time", "next one"],
  ng: ["sing along", "spring morning", "long song", "young king", "bring something", "running late", "English language", "strong feeling"],
  l: ["little light", "feel lucky", "long line", "love life", "call later", "blue lake", "look left", "all day"],
  r: ["red rose", "right around", "really ready", "front room", "around here", "more work", "car ride", "three friends"],
  y: ["yes, you", "young year", "yellow yard", "use your", "beautiful music", "a few years", "yesterday morning", "your idea"],
  w: ["warm water", "we will", "want one", "work well", "right way", "always welcome", "walk away", "one week"],
};

const connectedRules = [
  { number: "01", title: "辅音 + 元音", en: "Linking", example: "pick‿it‿up", note: "前一个词末辅音自然移到后一个词开头，气流不要中断。", speak: "Pick it up." },
  { number: "02", title: "闪音 T / D", en: "Flap T", example: "get‿it / water", note: "重读元音与非重读元音之间，t/d 快速轻弹，听感接近短 d。", speak: "Get it. Water. Better." },
  { number: "03", title: "弱读与央元音", en: "Reduction", example: "a cup‿of tea", note: "功能词失去重音，to、for、and 等常缩短为含 /ə/ 的弱读形式。", speak: "A cup of tea for you." },
  { number: "04", title: "不完全爆破", en: "No release", example: "black coffee", note: "爆破音后接另一个辅音时，先到位但常不明显释放第一下爆破。", speak: "Black coffee. Big day." },
  { number: "05", title: "同化与融合", en: "Assimilation", example: "did you → /dɪdʒu/", note: "相邻音互相影响，舌位会合并，让整句话更顺。", speak: "Did you get it? Would you help?" },
];

export default function Home() {
  const [family, setFamily] = useState<Family>("元音");
  const [activeId, setActiveId] = useState("i");
  const [rate, setRate] = useState(0.82);
  const [playing, setPlaying] = useState("");
  const [learned, setLearned] = useState<string[]>([]);
  const [practiceTab, setPracticeTab] = useState<"words" | "phrases" | "sentences">("words");

  const active = phonemes.find((item) => item.id === activeId) ?? phonemes[0];
  const contrast = contrasts[active.id];
  const isVoiceless = active.traits.includes("清辅音");
  const isVoiced = active.family === "元音" || active.traits.includes("浊辅音");
  const activeWords: Array<[string, string]> = [
    ...active.words,
    ...(extraWords[active.id] ?? []).map((word) => [word, `含 /${active.symbol}/`] as [string, string]),
  ].slice(0, 10);
  const activePhrases = [...active.phrases, ...(extraPhrases[active.id] ?? [])].slice(0, 10);
  const wordAt = (index: number) => activeWords[index % activeWords.length][0];
  const activeSentences = [
    active.sentence,
    `Please say “${wordAt(3)}” one more time.`,
    `I heard the word “${wordAt(4)}” very clearly.`,
    `Let's practice “${wordAt(5)}” at a natural speed.`,
    `She repeated “${wordAt(6)}” slowly for the class.`,
    `Can you say “${wordAt(7)}” without stopping?`,
    `We used “${wordAt(8)}” in today's conversation.`,
    `He wrote “${wordAt(9)}” in his notebook.`,
    `Listen carefully when I say “${wordAt(1)}”.`,
    `They practiced “${wordAt(2)}” together after class.`,
  ];
  const groups = useMemo(
    () => order.map((name) => ({ name, items: phonemes.filter((item) => item.family === family && item.group === name) })).filter((group) => group.items.length),
    [family],
  );

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    currentAudio?.pause();
    currentAudio = null;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => voice.lang === "en-US") ?? voices.find((voice) => voice.lang.startsWith("en")) ?? null;
    utterance.onstart = () => setPlaying(text);
    utterance.onend = () => setPlaying("");
    utterance.onerror = () => setPlaying("");
    window.speechSynthesis.speak(utterance);
  };

  const playNative = (text: string) => {
    const key = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const source = nativeAudio[key];
    if (!source) {
      speak(text);
      return;
    }
    window.speechSynthesis.cancel();
    currentAudio?.pause();
    const audio = new Audio(new URL(source.replace(/^\/+/, ""), new URL(".", window.location.href)).href);
    currentAudio = audio;
    audio.playbackRate = rate === 0.72 ? 0.78 : 1;
    setPlaying(text);
    audio.onended = () => { if (currentAudio === audio) { currentAudio = null; setPlaying(""); } };
    audio.onerror = () => { if (currentAudio === audio) currentAudio = null; setPlaying(""); speak(text); };
    void audio.play();
  };

  const playPhoneme = (item: Phoneme) => {
    const source = phonemeAudio[item.id];
    if (!source) return;
    window.speechSynthesis.cancel();
    currentAudio?.pause();
    const audio = new Audio(new URL(source.replace(/^\/+/, ""), new URL(".", window.location.href)).href);
    currentAudio = audio;
    audio.playbackRate = rate === 0.72 ? 0.8 : 1;
    setPlaying(`phoneme:${item.id}`);
    audio.onended = () => { if (currentAudio === audio) { currentAudio = null; setPlaying(""); } };
    audio.onerror = () => { if (currentAudio === audio) { currentAudio = null; setPlaying(""); } };
    void audio.play();
  };

  const playContrast = () => {
    if (!contrast) return;
    currentAudio?.pause();
    currentAudio = null;
    window.speechSynthesis.cancel();
    const queue = [contrast[0], contrast[1], contrast[0], contrast[1]];
    let index = 0;
    const next = () => {
      const word = queue[index];
      const source = nativeAudio[word];
      if (!source) { speak(`${contrast[0]}. ${contrast[1]}.`); return; }
      const audio = new Audio(new URL(source.replace(/^\/+/, ""), new URL(".", window.location.href)).href);
      currentAudio = audio;
      audio.playbackRate = rate === 0.72 ? 0.8 : 1;
      setPlaying(`contrast:${word}`);
      audio.onended = () => { index += 1; if (index < queue.length) window.setTimeout(next, 260); else setPlaying(""); };
      audio.onerror = () => { setPlaying(""); speak(`${contrast[0]}. ${contrast[1]}.`); };
      void audio.play();
    };
    next();
  };

  const selectPhoneme = (item: Phoneme) => {
    setActiveId(item.id);
    playPhoneme(item);
    if (window.innerWidth < 920) {
      window.setTimeout(() => document.getElementById("detail")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  };

  const toggleLearned = () => {
    setLearned((current) => current.includes(active.id) ? current.filter((id) => id !== active.id) : [...current, active.id]);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回顶部">
          <span className="brand-mark">A</span>
          <span><strong>美音发音室</strong><small>AMERICAN IPA LAB</small></span>
        </a>
        <nav aria-label="主导航">
          <a href="#sounds">音标分类</a>
          <a href="#rules">连读规则</a>
          <a className="nav-cta" href="#sounds">开始练习 <span>→</span></a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>●</span> FROM SOUND TO SPEECH</p>
          <h1>从一个音标开始，<br /><em>说出自然美音。</em></h1>
          <p className="hero-lead">按发音方式系统分类，每个读音都配有口型提示、常用表达与真实语流规则。点击，就能听。</p>
          <div className="hero-actions">
            <a className="primary-button" href="#sounds">探索 41 个核心音位 <span>↓</span></a>
            <button className="listen-demo" onClick={() => speak("Clear sounds make confident speech.")}><span className="play-icon">▶</span><span><strong>试听一句</strong><small>Clear sounds make confident speech.</small></span></button>
          </div>
        </div>
        <div className="hero-board" aria-label="发音学习路径">
          <div className="orbit orbit-one">/æ/</div>
          <div className="orbit orbit-two">/r/</div>
          <div className="orbit orbit-three">/tʃ/</div>
          <div className="hero-card-main">
            <span className="card-kicker">TODAY’S SOUND</span>
            <strong>/i/</strong>
            <button onClick={() => playPhoneme(phonemes[0])}>▶ 真人单音</button>
            <p>see · need · people</p>
          </div>
          <div className="mini-path"><span>分类</span><b>→</b><span>音标</span><b>→</b><span>语流</span></div>
        </div>
      </section>

      <section className="sound-section" id="sounds">
        <div className="section-heading">
          <div><p className="eyebrow">01 · SOUND MAP</p><h2>先选类别，再攻克一个音</h2></div>
          <p>同类音放在一起对比，能更快建立口型与听觉边界。</p>
        </div>

        <div className="family-switch" role="tablist" aria-label="音标大类">
          {(["元音", "辅音"] as Family[]).map((item) => (
            <button key={item} className={family === item ? "active" : ""} onClick={() => { setFamily(item); const first = phonemes.find((p) => p.family === item); if (first) setActiveId(first.id); }} role="tab" aria-selected={family === item}>
              <span>{item}</span><small>{item === "元音" ? "VOWELS · 17" : "CONSONANTS · 24"}</small>
            </button>
          ))}
          <div className="speed-control" aria-label="朗读速度">
            <span>语速</span>
            <button className={rate === 0.72 ? "active" : ""} onClick={() => setRate(0.72)}>慢速</button>
            <button className={rate === 0.92 ? "active" : ""} onClick={() => setRate(0.92)}>自然</button>
          </div>
        </div>

        <div className="sound-workspace">
          <div className="sound-map" role="tabpanel">
            {groups.map((group) => (
              <div className="sound-group" key={group.name}>
                <div className="group-title"><h3>{group.name}</h3><span>{group.items[0].groupEn}</span><i>{group.items.length}</i></div>
                <div className="phoneme-grid">
                  {group.items.map((item) => (
                    <button key={item.id} className={`phoneme-button ${item.id === "eh" ? "dual-symbol" : ""} ${active.id === item.id ? "selected" : ""} ${learned.includes(item.id) ? "learned" : ""}`} onClick={() => selectPhoneme(item)} aria-label={`选择并播放独立单音 ${phonemeNotation(item)}`}>
                      <span>{phonemeNotation(item)}</span><small>{item.anchor}</small><b aria-hidden="true">▶</b><em>真人单音</em>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="detail-panel" id="detail">
            <div className="detail-topline"><span>{active.family} / {active.group} · NATIVE AUDIO</span><button onClick={toggleLearned}>{learned.includes(active.id) ? "✓ 已掌握" : "○ 标记掌握"}</button></div>
            <div className="sound-identity">
              <button className={`big-sound ${active.id === "eh" ? "dual-symbol" : ""} ${playing === `phoneme:${active.id}` ? "is-playing" : ""}`} onClick={() => playPhoneme(active)} aria-label={`播放真人独立单音 ${phonemeNotation(active)}`}><span>{phonemeNotation(active)}</span><small>{playing === `phoneme:${active.id}` ? "真人单音播放中…" : "播放真人单音"}</small><i>▶</i><div className="sound-wave" aria-hidden="true"><b></b><b></b><b></b><b></b><b></b></div></button>
              <div><p>{active.label}</p><h3>{active.anchor}</h3><span>{active.anchorIpa}</span></div>
            </div>

            <div className="mouth-tip"><span className="tip-icon">发</span><div><strong>口型与舌位</strong><p>{active.tip}</p></div></div>
            <div className="traits">{active.traits.map((trait) => <span key={trait}>{trait}</span>)}</div>

            <div className="coach-grid">
              <div><span>1</span><strong>{active.family === "元音" ? "固定口型" : "找到成阻点"}</strong><p>{active.family === "元音" ? `${active.traits[0]}，先把嘴形稳定住。` : `${active.traits[1] ?? "发音位置"}，先到位再出声。`}</p></div>
              <div><span>2</span><strong>{isVoiceless ? "只送气" : "打开声带"}</strong><p>{isVoiceless ? "手指轻触喉咙，应几乎感觉不到振动。" : "手指轻触喉咙，应感到连续或短暂振动。"}</p></div>
              <div><span>3</span><strong>立即自检</strong><p>{isVoiced ? "音量不必大，保持气流和共鸣稳定。" : "不要在辅音后面多加一个“呃”音。"}</p></div>
            </div>

            {contrast && <div className="contrast-lab">
              <div className="block-title"><span>AB</span><h4>最小对立音</h4><small>MINIMAL PAIR</small><button onClick={playContrast}>▶ 连续对比</button></div>
              <div className="contrast-words">
                <button onClick={() => playNative(contrast[0])}><b>{contrast[0]}</b><small>A · {nativeAudio[contrast[0]] ? "真人音频" : "美式朗读"}</small><i>▶</i></button>
                <span>VS</span>
                <button onClick={() => playNative(contrast[1])}><b>{contrast[1]}</b><small>B · {nativeAudio[contrast[1]] ? "真人音频" : "美式朗读"}</small><i>▶</i></button>
              </div>
              <p>{contrast[2]}</p>
            </div>}

            <div className="practice-deck">
              <div className="practice-tabs" role="tablist" aria-label="发音练习内容">
                <button className={practiceTab === "words" ? "active" : ""} onClick={() => setPracticeTab("words")} role="tab" aria-selected={practiceTab === "words"}><span>常用单词</span><b>10</b></button>
                <button className={practiceTab === "phrases" ? "active" : ""} onClick={() => setPracticeTab("phrases")} role="tab" aria-selected={practiceTab === "phrases"}><span>高频词组</span><b>10</b></button>
                <button className={practiceTab === "sentences" ? "active" : ""} onClick={() => setPracticeTab("sentences")} role="tab" aria-selected={practiceTab === "sentences"}><span>完整句子</span><b>10</b></button>
              </div>

              {practiceTab === "words" && <div className="practice-block" role="tabpanel">
                <div className="block-title"><span>01</span><h4>常用单词</h4><small>10 WORDS · 点击逐个听</small></div>
                <div className="word-list">{activeWords.map(([word, ipa]) => <button key={word} onClick={() => nativeAudio[word] ? playNative(word) : speak(word)}><b>{word}</b><span>{ipa}</span><i>▶</i></button>)}</div>
              </div>}

              {practiceTab === "phrases" && <div className="practice-block" role="tabpanel">
                <div className="block-title"><span>02</span><h4>高频词组</h4><small>10 PHRASES · 连贯跟读</small></div>
                <div className="phrase-list">{activePhrases.map((phrase) => <button key={phrase} onClick={() => speak(phrase)}><span>{phrase}</span><i>▶</i></button>)}</div>
              </div>}

              {practiceTab === "sentences" && <div className="practice-block" role="tabpanel">
                <div className="block-title"><span>03</span><h4>完整句子</h4><small>10 SENTENCES · 语流练习</small></div>
                <div className="sentence-list">{activeSentences.map((sentence, index) => <button className="sentence-card" key={sentence} onClick={() => speak(sentence)}><b>{String(index + 1).padStart(2, "0")}</b><span>“{sentence}”</span><i>▶</i></button>)}</div>
              </div>}
            </div>
            <div className="rule-note"><span>连</span><div><strong>这个音的语流提示</strong><p>{active.rule}</p></div></div>
          </aside>
        </div>
      </section>

      <section className="rules-section" id="rules">
        <div className="section-heading light">
          <div><p className="eyebrow">02 · CONNECTED SPEECH</p><h2>音对了，还要把它们连起来</h2></div>
          <p>美式口语的自然感，来自重音、弱读和音与音之间的顺滑交接。</p>
        </div>
        <div className="rules-grid">
          {connectedRules.map((rule) => (
            <article className="rule-card" key={rule.number}>
              <div><span>{rule.number}</span><button onClick={() => speak(rule.speak)} aria-label={`播放 ${rule.example}`}>▶</button></div>
              <small>{rule.en}</small><h3>{rule.title}</h3><strong>{rule.example}</strong><p>{rule.note}</p>
            </article>
          ))}
        </div>
        <div className="rule-banner"><span>7 DAYS</span><div><strong>练习建议：每天只攻克一组相近音</strong><p>先听辨，再模仿单词，最后把音放进词组和句子。准确比速度更重要。</p></div><a href="#sounds">回到音标表 ↑</a></div>
      </section>

      <footer><div className="brand inverse"><span className="brand-mark">A</span><span><strong>美音发音室</strong><small>AMERICAN IPA LAB</small></span></div><p>听清每个音，开口更自信。</p><div className="audio-credit">真人单音由 Philip Neal Whitman 为 <a href="https://ielp.ehe.osu.edu/sep/resources/interactive-ipa-charts/" target="_blank" rel="noreferrer">The Ohio State University Spoken English Program</a> 录制（CC BY-NC）；真人词音频来自 <a href="https://dictionaryapi.dev/" target="_blank" rel="noreferrer">Free Dictionary API / Wiktionary</a>。</div><span>Built for everyday practice</span></footer>
    </main>
  );
}
