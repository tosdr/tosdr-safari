/*global safari:false, Tosdr:false*/
"use strict";

function getTosButton (tab) {
  var toolbarItems = safari.extension.toolbarItems;
  for (var toolbarItemsCount = 0, toolbarItemsLength = toolbarItems.length; toolbarItemsCount < toolbarItemsLength; ++toolbarItemsCount) {
    var toolbarItem = toolbarItems[toolbarItemsCount];
      if (toolbarItem.identifier == "tos button") {
      var tabs = toolbarItem.browserWindow.tabs;
      for (var tabsCount = 0, tabsLength = tabs.length; tabsCount < tabsLength; ++tabsCount) {
        var _tab = tabs[tabsCount];
        if (_tab == tab) {
          return toolbarItem;
        }
      }
    }
  }
}

safari.application.addEventListener('navigate', function (event) {
  var service = Tosdr.getService(event.target.url);
  var button = getTosButton(event.target);
  if (service && service.tosdr.rated) {
    button.image = safari.extension.baseURI + service.tosdr.rated.toLowerCase() + '.png';
  }
  else {
    button.image = safari.extension.baseURI + 'false.png';
  }
});

safari.application.addEventListener("command", function (event) {
  if (event.command == 'open tosdr site') {
    safari.application.openBrowserWindow().activeTab.url = 'http://tos-dr.info';
  }
}, false);
