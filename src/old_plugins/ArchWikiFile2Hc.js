/*
 *  Wiki Monkey - MediaWiki bot and editor assistant that runs in the browser
 *  Copyright (C) 2011-2013 Dario Giovannetti <dev@dariogiovannetti.net>
 *
 *  This file is part of Wiki Monkey.
 *
 *  Wiki Monkey is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Wiki Monkey is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Wiki Monkey.  If not, see <http://www.gnu.org/licenses/>.
 */

WM.Plugins.ArchWikiFile2Hc = new function () {
    this.main = function (args) {
        // Out of date, should use WM.Parser #############################################

        var source = WM.Editor.readSource();

        var re3 = /\{\{ *[Ff]ile\s*\|(?: *(?:name|1) *\=)?(\n*(?:(?!\{\{|\||<[Nn][Oo][Ww][Ii][Kk][Ii]>|\=).\n*)+?)\|(?: *(?:content|2) *\=)?(\n*(?:(?!\{\{|\=).\n*)*?)\}\}/g;
        var re4 = /\{\{ *[Ff]ile\s*\|(?: *(?:name|1) *\=)?(\n*(?:(?!\{\{|\||<[Nn][Oo][Ww][Ii][Kk][Ii]>|\=).\n*)+?)\|(?: *(?:content|2) *\=)?(\n*(?:(?!\{\{).\n*)*?)\}\}/g;
        var re5 = /\{\{ *[Ff]ile\s*\|(?: *(?:name|1) *\=)?(\n*(?:(?!\{\{|\||<[Nn][Oo][Ww][Ii][Kk][Ii]>).\n*)+?)\|(?: *(?:content|2) *\=)?(\n*(?:(?!\{\{).\n*)*?)\}\}/g;

        var newtext = source.replace(re3, '{{hc|$1|$2}}');
        // Note the {{hc|1=$1|$2}} case is impossible
        newtext = newtext.replace(re4, '{{hc|$1|2=$2}}'); // Must come after re3
        newtext = newtext.replace(re5, '{{hc|1=$1|2=$2}}'); // Must come after re4

        if (newtext != source) {
            WM.Editor.writeSource(newtext);
            WM.Log.logInfo("Template:File replaced wit Template:hc");
        }

        var test = newtext.match(/\{\{ *[Ff]ile/g);

        if (test) {
            WM.Log.logWarning(test.length + ' File instances require manual intervention.');
        }
    };
};
