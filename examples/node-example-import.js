#!/usr/bin/env node

// This example accepts an image piped to it with, for example, 
// `fswebcam test.jpg && node-example-import.js --row 50 --image test.jpg --format json`
// and returns data of the cross section in specified format at the specified row.

var options = parseArgv(process.argv)

if (options.hasOwnProperty('help')) {
  help()
}
else {
  go()
}


function go() {
  
  var SpectralWorkbench = require('../dist/spectral-workbench.js').SpectralWorkbench;
  
  var image;

  options.row    = options.row || 0;
  options.format = options.format || 'csv';
  options.image   = options.image;
  
  image = new SpectralWorkbench.Image(false, {
            url: options.image
          }); 

  var data = image.getLine(options.row);

  data.forEach(function(line, i) {

    // average RGB:
    data[i] = [
      i, 
      ( line[0] +
        line[1] +
        line[2] ) / 3
    ];

  });

  var spectrum = new SpectralWorkbench.Spectrum(data);

  if      (options.format === "csv")  console.log(spectrum.encodeCSV());
  else if (options.format === "json") console.log(spectrum.encodeJSON());
  process.exit(0)

}


function help() {
  console.log('node-example-import.js')
  console.log('  --format <csv|json> the data format to output. Default: csv')
  console.log('  --row    <integer>  to cross-section the image. Default: 0')
  console.log('  --image  <filepath> Example: test.jpg')
  console.log('')
  console.log('This example accepts an image piped to it with, for example,')
  console.log('`fswebcam test.jpg && node-example-import.js --row 50 --image test.jpg --format json`')
  console.log('and returns data of the cross section in specified format at the specified row.')
  console.log('')
}

// This is the standard function for parsing process.argv. It will return
// an object that where `--argumentName` is a property name and the
// proceding argument is the value. If there is no proceeding value then
// it will be interpreted as a boolean true.
function parseArgv(argv) {
  params = {}
  argv.forEach(function(arg, i) {
    if (arg.substr(0, 2) == '--') {
      paramName = arg.substr(2, arg.length)
      nextArg = argv[i+1]
      if (typeof nextArg == 'string' && nextArg.substr(0, 2) == '--') {
        params[paramName] = true
      }
      else {
        params[paramName] = nextArg
      }
    }
  })
  return params
}

