// Generated by CoffeeScript 2.0.3
// Wiki Monkey - MediaWiki bot and editor-assistant user script
// Copyright (C) 2011 Dario Giovannetti <dev@dariogiovannetti.net>

// This file is part of Wiki Monkey.

// Wiki Monkey is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Wiki Monkey is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Wiki Monkey.  If not, see <http://www.gnu.org/licenses/>.
var Async, Obj;

Async = require('../../lib.js.generic/dist/Async');

Obj = require('../../lib.js.generic/dist/Obj');

module.exports = class exports {
  constructor(WM) {
    this.WM = WM;
  }

  recurseTree(params) {
    params.callChildren = this.WM.Cat._recurseTreeCallChildren;
    return Async.recurseTreeAsync(params);
  }

  recurseTreeContinue(params) {
    return Async.recurseTreeAsync(params);
  }

  _recurseTreeCallChildren(params) {
    return this.WM.Cat.getSubCategories(params.node, this.WM.Cat._recurseTreeCallChildrenContinue, params);
  }

  _recurseTreeCallChildrenContinue(subCats, params) {
    var i, len, subCat;
    for (i = 0, len = subCats.length; i < len; i++) {
      subCat = subCats[i];
      params.children.push(subCat.title);
    }
    return Async.recurseTreeAsync(params);
  }

  getSubCategories(parent, call, callArgs) {
    return this.WM.Cat._getMembers(parent, "subcat", call, callArgs);
  }

  getAllMembers(parent, call, callArgs) {
    return this.WM.Cat._getMembers(parent, null, call, callArgs);
  }

  _getMembers(name, cmtype, call, callArgs) {
    var query;
    query = {
      action: "query",
      list: "categorymembers",
      cmtitle: name,
      cmlimit: 500
    };
    if (cmtype) {
      query.cmtype = cmtype;
    }
    return this._getMembersContinue(query, call, callArgs, []);
  }

  _getMembersContinue(query, call, callArgs, members) {
    return this.WM.MW.callAPIGet(query, function(res, args) {
      members = members.concat(res.query.categorymembers);
      if (res["query-continue"]) {
        query.cmcontinue = res["query-continue"].categorymembers.cmcontinue;
        return this._getMembersContinue(query, call, args, members);
      } else {
        return call(members, args);
      }
    }, callArgs, null);
  }

  getParentsAndInfo(name, call, callArgs) {
    var query;
    query = {
      action: "query",
      prop: "categories|categoryinfo",
      titles: name,
      clprop: "hidden",
      cllimit: 500
    };
    return this._getParentsAndInfoContinue(query, call, callArgs, [], null);
  }

  _getParentsAndInfoContinue(query, call, callArgs, parents, info) {
    return this.WM.MW.callAPIGet(query, function(res, args) {
      var page;
      page = Obj.getFirstItem(res.query.pages);
      if (page.categories) {
        parents = parents.concat(page.categories);
      }
      if (page.categoryinfo) {
        info = page.categoryinfo;
      }
      if (res["query-continue"]) {
        // Request categoryinfo only once
        query.prop = "categories";
        query.clcontinue = res["query-continue"].categories.clcontinue;
        return this._getParentsAndInfoContinue(query, call, args, parents, info);
      } else {
        return call(parents, info, args);
      }
    }, callArgs, null);
  }

};
