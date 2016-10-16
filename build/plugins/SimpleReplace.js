// Generated by CoffeeScript 1.11.1
var CSS,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

CSS = require('../../lib.js.generic/dist/CSS');

module.exports.SimpleReplace = (function() {
  var configuration, makeUI, storeRegExp;

  SimpleReplace.REQUIRES_GM = false;

  function SimpleReplace(WM) {
    this.WM = WM;
    this.mainAutoEnd = bind(this.mainAutoEnd, this);
    this.mainAutoWrite = bind(this.mainAutoWrite, this);
    this.storeConfiguration = bind(this.storeConfiguration, this);
  }

  makeUI = function() {
    var divMain, ignoreCase, ignoreCaseLabel, newString, newStringLabel, par1, par2, regexp, regexpLabel;
    CSS.addStyleElement("#WikiMonkey-SimpleReplace div " + "{margin-bottom:0.33em;} " + "#WikiMonkey-SimpleReplace input[type='text'] " + "{margin-left:0.33em; width:60%;}");
    divMain = document.createElement('div');
    divMain.id = "WikiMonkey-SimpleReplace";
    par1 = document.createElement('div');
    regexpLabel = document.createElement('span');
    regexpLabel.innerHTML = 'RegExp pattern:';
    regexp = document.createElement('input');
    regexp.setAttribute('type', 'text');
    regexp.id = "WikiMonkey-SimpleReplace-RegExp";
    ignoreCase = document.createElement('input');
    ignoreCase.setAttribute('type', 'checkbox');
    ignoreCase.id = "WikiMonkey-SimpleReplace-IgnoreCase";
    ignoreCaseLabel = document.createElement('span');
    ignoreCaseLabel.innerHTML = 'i';
    par1.appendChild(regexpLabel);
    par1.appendChild(regexp);
    par1.appendChild(ignoreCase);
    par1.appendChild(ignoreCaseLabel);
    par2 = document.createElement('div');
    newStringLabel = document.createElement('span');
    newStringLabel.innerHTML = 'New string:';
    newString = document.createElement('input');
    newString.setAttribute('type', 'text');
    newString.id = "WikiMonkey-SimpleReplace-NewString";
    par2.appendChild(newStringLabel);
    par2.appendChild(newString);
    divMain.appendChild(par1);
    divMain.appendChild(par2);
    return divMain;
  };

  SimpleReplace.prototype.makeUI = function(args) {
    return makeUI();
  };

  SimpleReplace.prototype.makeBotUI = function(args) {
    var divMain, par3, summary, summaryLabel;
    divMain = makeUI();
    par3 = document.createElement('div');
    summaryLabel = document.createElement('span');
    summaryLabel.innerHTML = 'Edit summary:';
    summary = document.createElement('input');
    summary.setAttribute('type', 'text');
    summary.id = "WikiMonkey-SimpleReplace-Summary";
    par3.appendChild(summaryLabel);
    par3.appendChild(summary);
    divMain.appendChild(par3);
    return divMain;
  };

  configuration = null;

  SimpleReplace.prototype.storeConfiguration = function() {
    configuration = {
      pattern: document.getElementById("WikiMonkey-SimpleReplace-RegExp").value,
      ignoreCase: document.getElementById("WikiMonkey-SimpleReplace-IgnoreCase").checked,
      newString: document.getElementById("WikiMonkey-SimpleReplace-NewString").value
    };
    this.WM.Log.logHidden("Pattern: " + configuration.pattern);
    this.WM.Log.logHidden("Ignore case: " + configuration.ignoreCase);
    return this.WM.Log.logHidden("New string: " + configuration.newString);
  };

  storeRegExp = function() {
    return configuration.regExp = new RegExp(configuration.pattern, "g" + (configuration.ignoreCase ? "i" : ""));
  };

  SimpleReplace.prototype.main = function(args, callNext) {
    var exc, newtext, source;
    this.storeConfiguration();
    try {
      storeRegExp();
    } catch (error) {
      exc = error;
      this.WM.Log.logError("Invalid pattern: " + exc);
      return false;
    }
    source = this.WM.Editor.readSource();
    newtext = source.replace(configuration.regExp, configuration.newString);
    if (newtext !== source) {
      this.WM.Editor.writeSource(newtext);
      this.WM.Log.logInfo("Text substituted");
    }
    if (callNext) {
      return callNext();
    }
  };

  SimpleReplace.prototype.mainAuto = function(args, title, callBot, chainArgs) {
    var exc, summary;
    this.storeConfiguration();
    try {
      storeRegExp();
    } catch (error) {
      exc = error;
      this.WM.Log.logError("Invalid pattern: " + exc);
      callBot(false, null);
      return false;
    }
    summary = document.getElementById("WikiMonkey-SimpleReplace-Summary").value;
    if (summary !== "") {
      return this.WM.MW.callQueryEdit(title, this.WM.Plugins.SimpleReplace.mainAutoWrite, [summary, callBot]);
    } else {
      this.WM.Log.logError("The edit summary cannot be empty");
      return callBot(false, null);
    }
  };

  SimpleReplace.prototype.mainAutoWrite = function(title, source, timestamp, edittoken, args) {
    var callBot, newtext, summary;
    summary = args[0];
    callBot = args[1];
    newtext = source.replace(configuration.regExp, configuration.newString);
    if (newtext !== source) {
      return this.WM.MW.callAPIPost({
        action: "edit",
        bot: "1",
        title: title,
        summary: summary,
        text: newtext,
        basetimestamp: timestamp,
        token: edittoken
      }, null, this.WM.Plugins.SimpleReplace.mainAutoEnd, callBot, null);
    } else {
      return callBot(0, null);
    }
  };

  SimpleReplace.prototype.mainAutoEnd = function(res, callBot) {
    if (res.edit && res.edit.result === 'Success') {
      return callBot(1, null);
    } else if (res.error) {
      this.WM.Log.logError(res.error.info + " (" + res.error.code + ")");
      return callBot(res.error.code, null);
    } else {
      return callBot(false, null);
    }
  };

  return SimpleReplace;

})();
