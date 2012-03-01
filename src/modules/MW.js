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

WM.MW = new function () {
    this.callAPIGet = function (params) {
        var id = WM.HTTP.sendGetSyncRequest(WM.getBaseURL() + "api.php?format=json" + joinParams(params));
        return JSON.parse(WM.HTTP.getResponseText(id));
    };
    
    this.callAPIPost = function (params) {
        var id = WM.HTTP.sendPostSyncRequest(WM.getBaseURL() + "api.php", "format=json" + joinParams(params), "Content-type", "application/x-www-form-urlencoded");
        return JSON.parse(WM.HTTP.getResponseText(id));
    };
    
    var joinParams = function (params) {
        var string = "";
        for (var key in params) {
            string += ("&" + key + "=" + params[key]);
        }
        return string;
    };
    
    // Never use this attribute directly, always use getUserInfo!!!
    var userInfo;
    
    this.getUserInfo = function () {
        if (!userInfo) {
            userInfo = this.callAPIGet({action: "query",
                                        meta: "userinfo",
                                        uiprop: "groups"});
        }
        return userInfo;
    };
    
    this.getUserName = function () {
        return this.getUserInfo().query.userinfo.name;
    };
    
    this.isUserBot = function () {
        var groups = this.getUserInfo().query.userinfo.groups;
        for each (var g in groups) {
            if (g == 'bot') {
                return true;
            }
        }
        return false;
    };
};