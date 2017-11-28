var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

var i = 1;
var url = "http://www.meiyuanguan.com/meinv/1.html";

function start(url){
	http.get(url,function(res){
		var html = '';
		var titles = [],
			time = new Date();
		res.setEncoding('utf-8');

		res.on("data",function(chunk){
			html += chunk;
		})
		res.on("end",function(){
			var $ = cheerio.load(html);
			var new_title = $("body h1").text().trim();
			savedImg($,new_title);
			var nextLink =  $(".ziyou a").attr('href')
			console.log("LINK:"+nextLink);
			i++;
			if (i <= 500 && nextLink) {  
				setTimeout(()=>{
					start(nextLink);
				},1000)              
			}
		})
	}).on("error",function(err){
		console.log('start:'+err)
	})
}

function savedContent($,new_title){
	$(".neirong p").each(function(index, el) {
		var html = $(this).text();
		html = html.replace(/\&nbsp;/g,"repalce");
		html = html + "\n";
		fs.appendFile('./data/'+new_title+'.txt','utf-8',function(err){
			if(err){console.log(err)}
		})
	});
}

function savedImg($,new_title){
	$("body img").each(function(index,el){
		var title = $(this).attr('alt');
		if(title === "" || title === undefined){
			title = $(this).attr('title');
		}
		if(title === "" || title === undefined){
			title = i;
		}
		var src = $(this).attr('src');
		request.head(src,function(err,res,body){
			if(err){console.log(err)};
			var time = +(new Date());
			request(src).pipe(fs.createWriteStream('./img/' + i + "——" + time + title+".jpg"));
		})
	})
}

start(url);