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

WM.RecentChanges = new function () {
    this._makeUI = function (filters) {
        var divContainer = document.createElement('div');
        divContainer.id = 'WikiMonkeyRCFilter';

        GM_addStyle("#WikiMonkeyRCFilter-Select, #WikiMonkeyRCFilter-Apply {float:left;} " +
                    "#WikiMonkeyRCFilter-Select {width:100%; margin-right:-16em;} " +
                    "#WikiMonkeyRCFilter-Select > p {margin:0 17em 0 0;} " +
                    "#WikiMonkeyRCFilter-Select > p > select {width:100%;} " +
                    "#WikiMonkeyRCFilter-Apply > input[type='button'] {margin-right:1em;} " +
                    "#WikiMonkeyRCFilter-Apply > input[type='checkbox'] {margin-right:0.4em;} " +
                    "#WikiMonkeyRCFilter-Options {clear:both;}");

        var selectFilterDiv = document.createElement('div');
        selectFilterDiv.id = 'WikiMonkeyRCFilter-Select';

        var selectFilterP = document.createElement('p');

        var selectFilter = document.createElement('select');

        var option;

        for (var f in filters) {
            option = document.createElement('option');
            option.innerHTML = filters[f][1];
            selectFilter.appendChild(option);
        }

        selectFilter.addEventListener("change", (function (filters) {
            return function () {
                var id = document.getElementById('WikiMonkeyRCFilter-Select').getElementsByTagName('select')[0].selectedIndex;
                var UI = document.getElementById('WikiMonkeyRCFilter-Options');
                // [1] Note that this must also be executed immediately, see [2]
                var makeUI = eval("WM.Plugins." + filters[id][0] + ".makeUI");
                if (makeUI instanceof Function) {
                    UI.replaceChild(makeUI(filters[id][2]), UI.firstChild);
                }
                else {
                    // Don't removeChild, otherwise if another plugin with
                    // interface is selected, replaceChild won't work
                    UI.replaceChild(document.createElement('div'), UI.firstChild);
                }
            }
        })(filters), false);

        selectFilterP.appendChild(selectFilter);
        selectFilterDiv.appendChild(selectFilterP);

        var applyFilterDiv = document.createElement('div');
        applyFilterDiv.id = 'WikiMonkeyRCFilter-Apply';

        var applyFilter = document.createElement('input');
        applyFilter.type = 'button';
        applyFilter.value = 'Apply filter';
        applyFilter.addEventListener("click", function () {
            var id = document.getElementById('WikiMonkeyRCFilter-Select').getElementsByTagName('select')[0].selectedIndex;
            eval("WM.Plugins." + filters[id][0] + ".main")(filters[id][2]);
            this.disabled = true;
        }, false);

        applyFilterDiv.appendChild(applyFilter);

        var showLog = document.createElement('input');
        showLog.type = 'checkbox';
        showLog.addEventListener("change", function () {
            document.getElementById('WikiMonkeyLog').style.display = (this.checked) ? 'block' : 'none';
            document.getElementById('WikiMonkeyRCFilter').style.marginBottom = (this.checked) ? '1em' : '0';
        }, false);

        applyFilterDiv.appendChild(showLog);

        var showLogLabel = document.createElement('span');
        showLogLabel.innerHTML = 'Show Log';

        applyFilterDiv.appendChild(showLogLabel);

        var divFilter = document.createElement('div');
        divFilter.id = "WikiMonkeyRCFilter-Options";

        // [2] Note that this is also executed onchange, see [1]
        var makeUI = eval("WM.Plugins." + filters[0][0] + ".makeUI");
        if (makeUI instanceof Function) {
            divFilter.appendChild(makeUI(filters[0][2]));
        }
        else {
            divFilter.appendChild(document.createElement('div'));
        }

        divContainer.appendChild(selectFilterDiv);
        divContainer.appendChild(applyFilterDiv);
        divContainer.appendChild(divFilter);

        return divContainer;
    };
};