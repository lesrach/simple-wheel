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

function savedImg($,new_title){
    str = reword(new_title)
    try{
         fs.mkdirSync(('./img/'+str));
    } catch (e){

    }
    $("body img").each(function(index,el){
        var title = $(this).attr('alt');
        var src = $(this).attr('src');
        request.head(src,function(err,res,body){

            try{
                 request(src).pipe(fs.createWriteStream('./img/'+ str + '/' + index +".jpg"));
            } catch (e){

            }

        })
    })
}

function reword(str){
    return str.replace(/(\\|\/|\[|\])/g,"")
}

start(url);
