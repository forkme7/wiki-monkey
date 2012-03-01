// ==UserScript==
// @id wiki-monkey-bot
// @name Wiki Monkey
// @namespace https://github.com/kynikos/wiki-monkey
// @author Dario Giovannetti <dev@dariogiovannetti.com>
// @version 1.8.0-bot
// @description MediaWiki-compatible bot and editor assistant that runs in the browser
// @website https://github.com/kynikos/wiki-monkey
// @supportURL https://github.com/kynikos/wiki-monkey/issues
// @updateURL https://raw.github.com/kynikos/wiki-monkey/master/src/configurations/WikiMonkey-bot.meta.js
// @icon http://cloud.github.com/downloads/kynikos/wiki-monkey/wiki-monkey.png
// @icon64 http://cloud.github.com/downloads/kynikos/wiki-monkey/wiki-monkey-64.png
// @match http://*.wikipedia.org/*
// @match https://wiki.archlinux.org/*
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/WikiMonkey.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/modules/ArchWiki.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/modules/Bot.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/modules/Cat.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/modules/Diff.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/modules/Editor.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/modules/HTTP.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/modules/Log.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/modules/MW.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/modules/Tables.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/modules/UI.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/plugins/ArchWikiFixHeader.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/plugins/ArchWikiNewTemplates.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/plugins/ArchWikiQuickReport.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/plugins/ArchWikiSaveTalk.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/plugins/ExpandContractions.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/plugins/MultipleLineBreaks.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/plugins/SimpleReplace.js
// @require https://raw.github.com/kynikos/wiki-monkey/1.8.0/src/plugins/UpdateCategoryTree.js
// ==/UserScript==

WM.UI.setEditor([
    [
        ["ArchWikiFixHeader", "Fix header", null],
        ["ArchWikiNewTemplates", "Use code templates", null],
        ["ExpandContractions", "Expand contractions", null],
        ["MultipleLineBreaks", "Multiple line breaks", null]
    ],
    [
        ["SimpleReplace", "RegExp substitution", ["1"]]
    ]
])

WM.UI.setDiff([
    [
        ["ArchWikiQuickReport", "Quick report",
         ["1", "User:" + WM.MW.getUserName() + "/RC_Patrol", "+ diff"]]
    ],
    [
        ["ArchWikiSaveTalk", "Save discussion",
         ["User:" + WM.MW.getUserName() + "/Discussions", "+ diff"]]
    ]
])

WM.UI.setWhatLinksHere([
    ["SimpleReplace", "Simple RegExp substitution", ["1"]]
])

WM.UI.setSpecial([
    [
        ["UpdateCategoryTree", "Update main ToC",
         [{"Table_of_Contents": ["Category:English", "en"],
           "Table_of_Contents_(Français)": ["Category:Français", "fr"],
           "Table_of_Contents_(Indonesia)": ["Category:Indonesia", "en"],
           "Table_of_Contents_(Italiano)": ["Category:Italiano", "it"],
           "Table_of_Contents_(Magyar)": ["Category:Magyar", "en"],
           "Table_of_Contents_(Slovenský)": ["Category:Slovenský", "en"],
           "Table_of_Contents_(Suomi)": ["Category:Suomi", "en"],
           "Table_of_Contents_(Svenska)": ["Category:Svenska", "en"],
           "Table_of_Contents_(Türkçe)": ["Category:Türkçe", "en"],
           "Table_of_Contents_(Ελληνικά)": ["Category:Ελληνικά", "en"],
           "Table_of_Contents_(Български)": ["Category:Български", "en"],
           "Table_of_Contents_(Српски)": ["Category:Српски", "en"],
           // rtl scripts create buggy output
           //"Table_of_Contents_(עברית)": ["Category:עברית", "en"],
           "Table_of_Contents_(ไทย)": ["Category:ไทย", "en"],
           "Table_of_Contents_(日本語)": ["Category:日本語", "en"]},
         "[[User:Kynikos/Wiki_Monkey|automatic]] update"]]
    ]
])

WM.main()