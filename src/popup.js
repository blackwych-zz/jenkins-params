//
// Copyright (c) 2017 Blackwych. All rights reserved.
// Licensed under the MIT License. See LICENSE file for full license information.
//

const RESULT = {
  'slack': {formatter: formatForSlack},
  'build-param': {formatter: formatForParamBuild},
};

function formatForSlack(data) {
  var text = '';

  text += '*[' + data.jobName + ']*\n';
  text += data.jobUrl + '\n';
  text += '\n';

  if (Object.keys(data.params).length > 0) {
    text += '```\n';

    for (var key in data.params) {
      var value = data.params[key];
      if (value.indexOf('\n') < 0) {
        text += '- ' + key + ': ' + value + '\n';
      } else {
        text += '- ' + key + ':\n' + value + '\n\n';
      }
    }

    text += '```\n';
  }

  return text;
}

function formatForParamBuild(data) {
  var url = data.jobUrl + '/parambuild';

  if (Object.keys(data.params).length > 0) {
    var params = [];
    for (var key in data.params) {
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data.params[key]));
    }

    url += '?' + params.join('&');
  }

  return url;
}

function updateResult(data) {
  for (var id in RESULT) {
    var formatter = RESULT[id].formatter;
    document.getElementById(id).textContent = data ? formatter(data) : '(failure)';
  }
}

document.getElementById('copy').addEventListener('click', function () {
  document.querySelector('.result.selected').select();
  document.execCommand('copy');
});

document.querySelectorAll('#tab > li > a').forEach(function (tab) {
  tab.addEventListener('click', function () {
    var targetId = this.dataset.target;
    for (var id in RESULT) {
      if (id === targetId) {
        document.querySelector('#tab > li > a[data-target="' + id + '"]').classList.add('selected');
        document.getElementById(id).classList.add('selected');
      } else {
        document.querySelector('#tab > li > a[data-target="' + id + '"]').classList.remove('selected');
        document.getElementById(id).classList.remove('selected');
      }
    }
  });
});

browser.runtime.onMessage.addListener(updateResult);

browser.tabs.executeScript(null, {file: '/browser-polyfill.min.js'});
browser.tabs.executeScript(null, {file: '/capture.js'}).then(function () {
  browser.tabs.query({active: true, currentWindow: true}).then(function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, null);
  });
});
