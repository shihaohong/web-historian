var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');
// require more modules/folders here!

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
};

var postCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

exports.handleRequest = function (req, res) {
  // use fs.readFile to read index.html
  var statusCode;
  var pathName = url.parse(req.url).pathname;

  if (req.method === 'GET') {
    if (req.url === '/') { // case that returns content of index.html
      // gets data needed by client
      fs.readFile(__dirname + '/public/index.html', 'utf-8', (err, content) => {
        if (err) {
          statusCode = 404;
          res.writeHead(statusCode, defaultCorsHeaders);
          res.end('Error 404: URL not found');
        } else {
          statusCode = 200;
          res.writeHead(statusCode, defaultCorsHeaders);
          res.end(content);
        }
      });
    } else {
      fs.readFile(__dirname + '/../archives/sites' + pathName, 'utf-8', (err, content) => {
        if (err) {
          statusCode = 404;
          res.writeHead(statusCode, defaultCorsHeaders);
          res.end('Error 404: URL not found');
        } else {
          statusCode = 200;
          res.writeHead(statusCode, defaultCorsHeaders);
          res.end(content);
        }
      });
    }
  } else if (req.method === 'POST') {
    statusCode = 302;
    var link = '';
    req.on('data', function(chunk) {
      link += chunk + '';
    });
    req.on('end', function () {
      link = link.slice(4);
      
      var urlArchived = function(result) {
        if (result) {
          console.log('found google.com!');
          fs.readFile(__dirname + '/../archives/sites/' + link, 'utf-8', (err, content) => {
            if (err) {
              statusCode = 404;
              res.writeHead(statusCode, defaultCorsHeaders);
              res.end('Error 404: URL not found');
            } else {
              statusCode = 200;
              res.writeHead(statusCode, defaultCorsHeaders);
              res.end(content);
            }
          });
        } else {
          var urlInList = function(result) {
            if (!result) {
              archive.addUrlToList(link, function() {});
            } 
            fs.readFile(__dirname + '/public/loading.html', 'utf-8', (err, content) => {
              if (err) {
                statusCode = 404;
                res.writeHead(statusCode, defaultCorsHeaders);
                res.end('Error 404: URL not found');
              } else {
                statusCode = 200;
                res.writeHead(statusCode, defaultCorsHeaders);
                res.end(content);
              }
            });            
          };
          archive.isUrlInList(link, urlInList);
          //   if !(isUrlInList())
          //     addUrlToList()
          //       write a new page to pending archives text doc for worker to process
          //   else
          //     render loading.html
        }
      };
      
      archive.isUrlArchived(link, urlArchived);
    });

    // fs.open(__dirname + '/../archives/sites.txt', 'w', (err, fd) => {
    //   if (err) {
    //     // redirect to loading.html
    //     // write to sites
    //     throw err;  
    //   } else {
    //     // if archived already, load that page
    //     fs.write(fd, link + '\n');
    //     fs.close(fd);
    //     res.writeHead(statusCode, postCorsHeaders);
    //     res.end();
    //   }
    // });    
  }
};
