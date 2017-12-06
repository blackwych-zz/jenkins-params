//
// Copyright (c) 2017 Blackwych. All rights reserved.
// Licensed under the MIT License. See LICENSE file for full license information.
//

function addKeyValue(params, e) {
  var key = e.previousElementSibling.textContent;
  var value = null;

  var input = e.querySelector('input:not([type="hidden"]),textarea,select');
  switch (input.tagName.toLowerCase()) {
  case 'input':
    switch (input.type.toLowerCase()) {
    case 'checkbox':
      value = input.checked ? 'true' : 'false';
      break;
    default:
      value = input.value;
    }
    break;
  case 'textarea':
  case 'select':
    value = input.value;
    break;
  default:
    value = '(unknown)';
  }

  if (key !== null && value !== null) {
    params[key] = value;
  }
}

function capture() {
  var elements = document.querySelectorAll('.setting-main');

  if (elements.length == 0) {
    browser.runtime.sendMessage(null);
    return;
  }
    
  var jobUrl = location.href.replace(/^(.*\/job\/[^\/]+).*$/, '$1');
  var jobName = jobUrl.split('/').slice(-1)[0];

  var params = {};
  elements.forEach(function (e) {
    addKeyValue(params, e);
  });

  var data = {
    jobName: jobName,
    jobUrl: jobUrl,
    params: params,
  };

  browser.runtime.sendMessage(data);
}

browser.runtime.onMessage.addListener(capture);
