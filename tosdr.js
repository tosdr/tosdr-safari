"use strict";

window.Tosdr = (function () {
  var services = [];

  function ajax (url, options) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          options.success(JSON.parse(xhr.responseText));
        }
      }
    };
    xhr.send();
  }

  function loadService (serviceName, serviceIndexData) {
    ajax('http://tosdr.org/services/' + serviceName + '.json', {
      success: function (service) {
        service.urlRegExp = new RegExp('https?://[^:]*' + service.url + '.*');
        service.points = serviceIndexData.points;
        service.links = serviceIndexData.links;
        if (!service.tosdr) {
          service.tosdr = { rated: false };
        }
        services.push(service);
        localStorage.setItem(serviceName, JSON.stringify(service));
      }
    });
  }

  ajax('http://tosdr.org/index/services.json', {
    success: function (servicesIndex) {
      for (var serviceName in servicesIndex) {
        loadService(serviceName, servicesIndex[serviceName]);
      }
    }
  });

  function getService (url) {
    var matchingServices = services.filter(function (service) {
      return service.urlRegExp.exec(url);
    });
    return matchingServices.length > 0 ? matchingServices[0] : null;
  }

  return {
    getServices: function () {
      return services;
    },
    getService: getService
  };
})();
