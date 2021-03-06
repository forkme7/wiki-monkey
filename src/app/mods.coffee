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

{jssc} = require('../modules/libs')
WM = require('../modules')


disableEditSummarySubmitOnEnter = ->
    $('#wpSummary').keydown( (event) ->
        # 'keyCode' is deprecated, but not all browsers support 'key' yet
        if event.key == 'Enter' or (typeof event.key == 'undefined' and
                                                    event.keyCode == 13)
            event.preventDefault()
            return false
    )


hideRollbackLinks = ->
    jssc(
        '@global span.mw-rollback-link':
            display: 'none'
    )


scrollToFirstHeading = ->
    window.scrollTo(0, $('#firstHeading').offset().top)


module.exports =
    modEditor: ->
        if WM.conf.disable_edit_summary_submit_on_enter
            disableEditSummarySubmitOnEnter()
        if WM.conf.scroll_to_first_heading
            scrollToFirstHeading()

    modRecentChanges: ->
        if WM.conf.hide_rollback_links
            hideRollbackLinks()

    modContributions: ->
        if WM.conf.hide_rollback_links
            hideRollbackLinks()
