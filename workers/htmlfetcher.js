// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

archive.readListOfUrls(function(urls) {
  var downloadableUrls = [];
  
  for (let i = 0; i < urls.length; i++) {
    var urlArchived = function(result) {
      if (!result) {
        downloadableUrls.push(urls[i]);
      }
      if (i === urls.length - 1) {
        console.log(downloadableUrls);
        archive.downloadUrls(downloadableUrls);
      }
    };  
    archive.isUrlArchived(urls[i], urlArchived);
  }
});