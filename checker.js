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

function onNewUrl (event) {
  var service = Tosdr.getService(event.target.url);
  var button = getTosButton(event.target);
  var popover = safari.extension.popovers.popover;
  popover.contentWindow.currentService = service;
  if (service) {
    if (service.tosdr.rated) {
      button.image = safari.extension.baseURI + 'icons/' + service.tosdr.rated.toLowerCase() + '.png';
    }
    else {
      button.image = safari.extension.baseURI + 'icons/false.png';
    }
  }
  else {
    button.image = safari.extension.baseURI + 'icons/none.png';
  }
}

safari.application.addEventListener('navigate', onNewUrl);
safari.application.addEventListener('activate', onNewUrl, true);
