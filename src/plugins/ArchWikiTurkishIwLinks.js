WM.Plugins.ArchWikiTurkishIwLinks = new function () {
    this.mainAuto = function (args, title) {
        var pageid = WM.MW.callQuery({prop: "revisions",
                                      rvprop: "content",
                                      titles: encodeURIComponent(title)});
        
        var trSource = pageid.revisions[0]["*"];
        
        var trTitle = trSource.match(/\{\{ *[Mm]ark to delete \(Türkçe\) *\| *(.+?) *\}\}/)[1];
        
        var enTitle = title.match(/^(.+?) \(Türkçe\)$/)[1];
        
        var page = WM.MW.callQuery({prop: "info|revisions",
                                      rvprop: "content|timestamp",
                                      intoken: "edit",
                                      titles: encodeURIComponent(enTitle)});
        
        var edittoken = page.edittoken;
        var timestamp = page.revisions[0].timestamp;
        var enSource = page.revisions[0]["*"];
        
        var newText = enSource.replace(/(\{\{ *i18n)/gi, "[[tr:" + trTitle + "]]\n$1");
        
        if (newText != enSource) {
            var summary = "add Turkish interlanguage link";
            
            var res = WM.MW.callAPIPost({action: "edit",
                                     bot: "1",
                                     title: encodeURIComponent(enTitle),
                                     summary: encodeURIComponent(summary),
                                     text: encodeURIComponent(newText),
                                     basetimestamp: timestamp,
                                     token: encodeURIComponent(edittoken)});
            
            if (res.edit && res.edit.result == 'Success') {
                return true;
            }
            else {
                WM.Log.logError(res['error']['info'] + " (" + res['error']['code'] + ")");
                return false;
            }
        }
        else {
            return true;
        }
    };
};
