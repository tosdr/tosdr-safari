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

function notify(title, body) {
  var notification = new Notification(title, {
    'body': body,
    // prevent duplicate notifications
    'tag' : 'tosdr-' + title
  });

  notification.onclick = function() {
    safari.application.activeBrowserWindow.openTab().url = 'http://tosdr.org/#' + title;
    this.close();
  }
}

RATING_TEXT = {
    "D": "The terms of service are very uneven or there are some important issues that need your attention.",
    "E": "The terms of service raise very serious concerns."
};

function onNewUrl (event) {
  var service = Tosdr.getService(event.target.url);
  var button = getTosButton(event.target);
  var popover = safari.extension.popovers.popover;
  popover.contentWindow.currentService = service;
  if (service) {
    if (service.tosdr.rated) {
      button.image = safari.extension.baseURI + 'icons/' + service.tosdr.rated.toLowerCase() + '.png';
      // show notification in case of bad rating
      if (service.tosdr.rated == 'D' || service.tosdr.rated == 'E') {
          notify(service.name, RATING_TEXT[service.tosdr.rated]);
      }
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
