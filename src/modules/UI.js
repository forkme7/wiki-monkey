/*
 *  Wiki Monkey - MediaWiki bot and editor assistant that runs in the browser
 *  Copyright (C) 2011-2012 Dario Giovannetti <dev@dariogiovannetti.com>
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

WM.UI = new function () {
    var editor = null;
    
    this.setEditor = function(rows) {
        editor = rows;
    };
    
    var diff = null;
    
    this.setDiff = function(rows) {
        diff = rows;
    };
    
    var whatLinksHere = null;
    
    this.setWhatLinksHere = function(rows) {
        whatLinksHere = rows;
    };
    
    var special = null;
    
    this.setSpecial = function(rows) {
        special = rows;
    };
    
    var makeButtons = function (functions) {
        var divContainer = document.createElement('div');
        divContainer.id = 'WikiMonkeyButtons';
        
        GM_addStyle("#WikiMonkeyButtons div.shortcut {position:absolute;} " +
                    "#WikiMonkeyButtons div.shortcut > input, #WikiMonkeyButtonAll {font-weight:bold;} " +
                    "#WikiMonkeyButtons div.row {margin-bottom:0.67em;} " +
                    "#WikiMonkeyButtons div.plugins {margin-left:9em;} " +
                    "#WikiMonkeyButtons div.pluginUI {display:inline-block; margin-right:0.33em;}");
        
        var buttonAll = document.createElement('input');
        buttonAll.setAttribute('type', 'button');
        buttonAll.setAttribute('value', 'Execute all');
        buttonAll.id = "WikiMonkeyButtonAll";
        
        var buttonsN, divRow, pRow, buttonRow, divPlugins, divFunction, buttonFunction, makeUI;
        var rowsN = 0;
        
        for each (var row in functions) {
            buttonRow = document.createElement('input');
            buttonRow.setAttribute('type', 'button');
            buttonRow.setAttribute('value', 'Execute row');
            
            pRow = document.createElement('div');
            pRow.className = "shortcut";
            pRow.appendChild(buttonRow);
            
            divPlugins = document.createElement('div');
            divPlugins.className = "plugins";
            
            divRow = document.createElement('div');
            divRow.className = "row";
            divRow.appendChild(pRow);
            
            buttonsN = 0;
            
            for each (var f in row) {
                buttonFunction = document.createElement('input');
                buttonFunction.setAttribute('type', 'button');
                buttonFunction.setAttribute('value', f[1]);
                
                for each (var button in [buttonFunction, buttonRow, buttonAll]) {
                    button.addEventListener("click", (function (fn, arg) {
                        return function () {
                            // window[string] doesn't work
                            eval("WM.Plugins." + fn + ".main")(arg);
                        }
                    })(f[0], f[2]), false);
                };
                
                divFunction = document.createElement('div');
                divFunction.className = 'pluginUI';
                divFunction.appendChild(buttonFunction);
                
                makeUI = eval("WM.Plugins." + f[0] + ".makeUI");
                if (makeUI instanceof Function) {
                    divFunction.appendChild(makeUI(f[2]));
                }
                
                divPlugins.appendChild(divFunction);
                
                buttonsN++;
            }
            
            divRow.appendChild(divPlugins);
            divContainer.appendChild(divRow);
            
            if (buttonsN <= 1) {
                buttonRow.disabled = true;
            }
            
            rowsN++;
        }
        
        if (rowsN > 1) {
            divRow = document.createElement('div');
            divRow.className = "row";
            divRow.appendChild(buttonAll);
            divContainer.appendChild(divRow);
        }
        
        return divContainer;
    };
    
    this.makeUI = function () {
        var baseNode, nextNode, UI;
        
        if (document.getElementById('editform')) {
            baseNode = document.getElementById('wpSummaryLabel').parentNode.parentNode;
            nextNode = document.getElementById('wpSummaryLabel').parentNode.nextSibling;
            UI = (editor) ? makeButtons(editor) : null;
        }
        else if (document.getElementById('mw-diff-otitle1')) {
            nextNode = document.getElementById('bodyContent').getElementsByTagName('h2')[0];
            baseNode = nextNode.parentNode;
            UI = (diff) ? makeButtons(diff) : null;
        }
        else if (document.getElementById('mw-whatlinkshere-list')) {
            baseNode = document.getElementById('bodyContent');
            nextNode = baseNode.getElementsByTagName('form')[0].nextSibling;
            UI = (whatLinksHere) ? WM.Bot.makeUI(whatLinksHere, document.getElementById('mw-whatlinkshere-list')) : null;
        }
        else if (location.pathname == "/index.php/Special:SpecialPages") {
            baseNode = document.getElementById('content');
            nextNode = document.getElementById('bodyContent');
            UI = (special) ? makeButtons(special) : null;
        }
        
        if (UI) {
            var main = document.createElement('fieldset');
            main.id = 'WikiMonkey';
            
            GM_addStyle("#WikiMonkey {position:relative;} " +
                        "#WikiMonkey fieldset {margin:0 0 1em 0;} " +
                        "#WikiMonkeyHelp {position:absolute; top:1em; right:0.6em;}");
            
            var legend = document.createElement('legend');
            legend.innerHTML = 'Wiki Monkey';
            main.appendChild(legend);
    
            var help = document.createElement('p');
            help.id = 'WikiMonkeyHelp';
            var helpln = document.createElement('a');
            helpln.href = 'index.php/User:Kynikos/Wiki_Monkey'
            helpln.innerHTML = 'help';
            help.appendChild(helpln);
            main.appendChild(help);
            
            main.appendChild(UI);
            main.appendChild(WM.Log.makeLogArea());
            baseNode.insertBefore(main, nextNode);
        }
    };
};