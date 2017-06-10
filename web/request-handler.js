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
      fs.readFile(__dirname + '/../test/testdata/sites' + pathName, 'utf-8', (err, content) => {
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
    
    req.on('data', function(data1) {
      console.log(data1 + '');
      
      // var parsedData = JSON.parse(data1 + '');
      // console.log(parsedData);
    });
    res.writeHead(statusCode, postCorsHeaders);
    res.end();
  }
  // var data;
  
  // fs.readFile(__dirname + '/public/index.html', 'utf-8', (err, content) => {
  //   // add error case for when readfile fails
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     data = content;
  //   }
  // });
  
  // console.log(res);
  // res.end(data);

  // res.end(archive.paths.list);
};
