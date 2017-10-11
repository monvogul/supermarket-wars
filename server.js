var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var request = require("request");
var path=require("path");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static', express.static(__dirname + '/app'));

app.get('/searchColes', function (req, res) {
    console.log(req.query);
  var colesURL = "https://shop.coles.com.au/online/COLRSSearchDisplay?storeId=20601&catalogId=10576&searchTerm="+ req.query.item + "&categoryId=&tabType=everything&tabId=everything&personaliseSort=false&langId=-1&beginIndex="+  req.query.beginIndex +"&browseView=false&facetLimit=100&searchSource=Q&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&errorView=AjaxActionErrorResponse&requesttype=ajax" ;

    request.get(colesURL,function(error,resp,body){
        res.send(body);

    })


})

app.get('/searchWoolies', function (req, res) {
    var dataObj = {
        SearchTerm: req.query.item,
        PageSize: 36,
        PageNumber: req.query.page,
        SortType: "TraderRelevance",
        IsSpecial: false,
        Filters: [],
        Location: "/shop/search/products?searchTerm=" + req.query.item
    };



    request.post({
        headers: {'Content-Type': 'application/json;charset=utf-8;'},
        url:     'https://www.woolworths.com.au/apis/ui/Search/products',
        json:   dataObj
    }, function(error, response, body){

        res.send(body) ;
    });




})


app.get('/', function (req, res) {

    res.sendFile(__dirname+"/index.html" ) ;
})


app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})