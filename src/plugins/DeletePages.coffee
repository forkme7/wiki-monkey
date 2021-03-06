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

WM = require('../modules')
App = require('../app')
{Plugin} = require('./_Plugin')


class module.exports.DeletePages extends Plugin
    @conf_default:
        enabled: false
        bot_label: "Delete pages"
        edit_summary: "delete page"

    main_bot: (title, callBot, chainArgs) ->
        summary = @conf.edit_summary

        WM.MW.callQuery({
                            prop: 'info'
                            intoken: 'delete'
                            titles: title
                        },
                        @mainAutoWrite,
                        [title, summary, callBot],
                        null)

    mainAutoWrite: (page, args) ->
        title = args[0]
        summary = args[1]
        callBot = args[2]

        deletetoken = page.deletetoken

        WM.MW.callAPIPost({
                            action: 'delete'
                            bot: '1'
                            title: title
                            token: deletetoken
                            reason: summary
                        },
                        @mainAutoEnd,
                        [title, callBot],
                        null)

    mainAutoEnd: (res, args) ->
        title = args[0]
        callBot = args[1]

        if not res.delete
            if res.error
                App.log.logError("#{App.log.linkToWikiPage(title, title)}
                                has not been deleted!\n#{res.error.info}
                                (#{res.error.code})")
                callBot(res.error.code, null)
            else
                callBot(false, null)
        else
            callBot(1, null)
