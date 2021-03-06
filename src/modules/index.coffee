# Wiki Monkey - MediaWiki bot and editor-assistant user script
# Copyright (C) 2011 Dario Giovannetti <dev@dariogiovannetti.net>
#
# This file is part of Wiki Monkey.
#
# Wiki Monkey is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Wiki Monkey is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Wiki Monkey.  If not, see <http://www.gnu.org/licenses/>.

mwmodpromise = mw.loader.using(['mediawiki.api.edit'
                                'mediawiki.notification'
                                'mediawiki.Uri'])

# Initialize the libraries immediately (especially babel-polyfill)
require('./libs').init()

Upgrade = require('./Upgrade')
{App} = require('../app')

# The ArchPackages module is currently unusable
# ArchPackages = require('./ArchPackages')
ArchWiki = require('./ArchWiki')
Cat = require('./Cat')
Diff = require('./Diff')
Editor = require('./Editor')
Interlanguage = require('./Interlanguage')
MW = require('./MW')
Parser = require('./Parser')
Tables = require('./Tables')
WhatLinksHere = require('./WhatLinksHere')

{Plugin} = require('../plugins/_Plugin')


class module.exports.WikiMonkey
    conf:
        default_bot_plugin: "SimpleReplace"
        default_recentchanges_plugin: "ArchWikiRCFilter"
        default_recentchanges_plugin_autoexecute: true
        default_newpages_plugin: "ArchWikiNPFilter"
        default_newpages_plugin_autoexecute: true
        update_check_wdays: [6]
        update_check_branch: 'master'
        hide_rollback_links: true
        disable_edit_summary_submit_on_enter: true
        scroll_to_first_heading: false

    Plugins:
        bot: []
        diff: []
        editor: []
        newpages: []
        recentchanges: []
        special: []

    constructor: (@wiki_name, @installed_plugins_temp...) ->
        @setup()
        $.when(mwmodpromise, $.ready).done(@init)

    setup: ->
        # mw.loader.load() doesn't return a promise nor support callbacks
        # mw.loader.using() only supports MW modules
        # $.getScript() ignores the cache by default
        # In the end using $.ajax() with setup parameters would be the only
        # option to configure WM in a callback, therefore use a global
        # configuration object for simplicity
        user_config = window.wikiMonkeyConfig or window.wikimonkey_config or {}

        for option, value of user_config when option of @conf
            @conf[option] = value
            delete user_config[option]

        for pmod in @installed_plugins_temp
            for pname, PluginSub of pmod \
                                    when PluginSub.prototype instanceof Plugin
                try
                    PluginSub.__configure(@wiki_name, user_config)
                catch error
                    # TODO: Properly extend Error, but beware that Babel
                    #       doesn't like it without specific plugins
                    if error.message is "Plugin disabled"
                        continue
                    throw error

                for interface_ of @Plugins \
                                        when PluginSub::["main_#{interface_}"]
                    @Plugins[interface_].push(PluginSub)

        if not $.isEmptyObject(user_config)
            console.warn("Unkown configuration options", user_config)

        delete @installed_plugins_temp

        Object.assign(module.exports, {
            conf: @conf
            Plugins: @Plugins
        })

    init: ->
        Object.assign(module.exports, {
            # The ArchPackages module is currently unusable
            # ArchPackages: new ArchPackages()
            ArchWiki: new ArchWiki()
            Cat: new Cat()
            Diff: new Diff()
            Editor: new Editor()
            Interlanguage: new Interlanguage()
            MW: new MW()
            Parser: new Parser()
            Tables: new Tables()
            WhatLinksHere: new WhatLinksHere()
        })

        new Upgrade()
        App()
