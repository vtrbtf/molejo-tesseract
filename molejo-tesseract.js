'use strict';

let tesseract = require("node-tesseract"),
    fs = require("fs"),
    http = require("http");


const  filename = "molejo-schedule.jpg";

var options = {
       hostname: 'www.molejo.com.br',
       port: 80,
       path: '/mobile/index.jpg',
       method: 'GET',
       headers: {
		  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36'
		}
};


let download =  (filename, cb) => {
	console.log( "Downloading schedule ... " )

	let fileStream = fs.createWriteStream(filename);
	let req = http.get(options, (resp) => {
		resp.pipe(fileStream);
		fileStream.on("finish", () =>  { 
			console.log("-- Download finished")
			fileStream.close(cb); 
		}).on("error", ( err ) => {
				fs.unlink(filename);
				console.log(`Err: ${err}`);
			});
	})
}

let processText = ( text ) => {
	text.split("\n").forEach( (e) => {
		let matches = e.match( /^[0-9]{2}\/[0-9]{2}/ );
		if ( matches ) {
		     console.log(matches.input)
		}
	})
}


download(filename, () => {  
	let path = `${__dirname}/${filename}`;
	console.log(`PATH: ${path}`)
	tesseract.process(path, (err, text) => {
		if(err) {
	            console.error(err);
		} else {
		    processText(text)
		}

	})
})
