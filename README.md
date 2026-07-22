# 美音发音室 · American IPA Lab

一个按美式音标分类展开的交互式学习网站。

## 学习内容

- 元音：前元音、中元音、后元音、双元音
- 辅音：爆破音、摩擦音、破擦音、鼻音、近音
- 每个音位包含发音方法、对比听辨、10 个常用单词、10 个高频词组和 10 个完整句子
- 连读、闪音 T/D、弱读、不完全爆破和同化规则
- 真人单词音频以及浏览器美式英语朗读

## 在线使用

网站发布后可通过 GitHub Pages 免费访问：

https://sunnykittenqwq-arch.github.io/american-ipa-lab/

## 更新网站

修改 `app/page.tsx` 或 `app/globals.css` 后运行：

```bash
pnpm build:pages
```

将更新后的源码和 `docs/` 文件夹同步到 GitHub，GitHub Pages 会自动更新原网址。

## 音频说明

真人词音频来自 Free Dictionary API / Wiktionary，并依原音频许可使用。缺少真人音频的内容会使用浏览器内置的美式英语语音朗读。
