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

{jssc, styled, moment} = require('../../modules/libs')

LEVEL_TO_CLASS =
    5: 'hidden'
    8: 'json'
    10: 'debug'
    20: 'info'
    30: 'warning'
    40: 'error'

Line = styled.div(
    display: 'flex'
)

divmixin =
    fontFamily: 'monospace'
    color: '#eee'

Timestamp = styled.div({
    divmixin...
    marginRight: '1em'
    whiteSpace: 'nowrap'
})

Text = styled.div({
    divmixin...

    '& a':
        color: 'inherit'
        textDecoration: 'underline'
})

{classes} = jssc({
    hidden: {}

    json: {}

    debug:
        color: 'cyan'

    info: {}

    warning:
        color: 'gold'

    error:
        color: 'red'
})

module.exports =
    name: 'Message'

    props:
        index:
            type: Number
            required: true

        text:
            type: String
            required: true

        level:
            type: Number
            required: true
            validator: (level) ->
                return level of LEVEL_TO_CLASS

        tstamp:
            type: Date
            required: true

    render: (h) ->
        h(Line, {
            key: @index
        }, [
            h(Timestamp
                moment(@tstamp).format('HH:mm:ss'))
            h(Text, {
                class: classes[LEVEL_TO_CLASS[@level]]
                # The message could contain links or other HTML
                domProps: {innerHTML: @text or ""}
            })
        ])
