var app =  angular.module('app',['ngAnimate']) ;

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);


app.controller('appCtrl',function ($scope,$http,asyncService) {
    $scope.searchTerm = '' ;
    $scope.isLoadingColes = false;
    $scope.isLoadingWoolies = false;
    $scope.searchResults = {woolies:[], coles:[]} ;
    $scope.noResultsColes = false;
    $scope.noResultsWoolies = false;
    $scope.coles = {pages:0, activePage: 0 , pageSize:24} ;
    $scope.woolies = {pages:0, activePage: 0 } ;
    
    $scope.clear = function() {
        $scope.searchResults = {woolies:[], coles:[]} ;
        $scope.searchTerm = "";
        $scope.noResultsColes = false;
        $scope.noResultsWoolies = false;
        $scope.coles = {pages:0, activePage: 0 , pageSize:24} ;
        $scope.woolies = {pages:0, activePage: 0 } ;

    }
    $scope.search = function(supermarket) {


        $scope.noResultsWoolies= false;
        $scope.noResultsColes= false;


        var colesURL = "http://localhost:3000/searchColes?item="+$scope.searchTerm + "&beginIndex=" +($scope.coles.activePage * $scope.coles.pageSize );
        var wooliesURL = "http://localhost:3000/searchWoolies?item="+$scope.searchTerm + "&page=" +($scope.woolies.activePage + 1);
        var urls ;
        if(!supermarket) {
            $scope.isLoadingColes = true;
            $scope.isLoadingWoolies = true;
            urls = [colesURL, wooliesURL];
         }else if(supermarket === 'coles'){
            $scope.isLoadingColes = true;
            urls = [colesURL];
        }else if(supermarket === 'woolies'){
            $scope.isLoadingWoolies = true;
            urls = [wooliesURL];
        }

        asyncService.loadDataFromUrls(urls).then(function(results){

            if(!supermarket && results[0] && results[0].data){
                $scope.isLoadingColes = false;
                $scope.processColes(results[0].data)
            }

            if( !supermarket && results[1] && results[1].data) {
                $scope.isLoadingWoolies = false;
                $scope.processWoolies(results[1].data) ;
            }

            if(supermarket){
                if(supermarket === 'coles'){
                    $scope.isLoadingColes = false;
                     $scope.processColes(results[0].data) ;
                }
                else{
                    $scope.isLoadingWoolies = false;
                    $scope.processWoolies(results[0].data) ;
                }

            }
        },function(error){
            $scope.isLoadingColes = false;
            $scope.isLoadingWoolies = false;
        })


    }

    $scope.processWoolies= function(result){
        $scope.searchResults.woolies = parseResponse.wooliesResp(result);

        var stats = result.SearchResultsCount ;
        $scope.woolies.pages = Math.ceil(stats/36);
        console.log("woolies pages", $scope.woolies.pages);

        if($.isEmptyObject($scope.searchResults.woolies)) {
            $scope.noResultsWoolies = true;
        }
    }

    $scope.processColes= function(result){
        var res = result ;

        var prodHtml = $(res).find("div" + "[data-colrs-transformer=colrsExpandFilter]");
        var products = JSON.parse(($(prodHtml).html())).products;
        var stats = JSON.parse(($(prodHtml).html())).searchInfo ;
        $scope.coles.pages = Math.ceil(stats.totalCount/stats.pageSize);
        $scope.searchResults.coles=  parseResponse.colesResp(products);
        if(!products || products.length < 1) {
            $scope.noResultsColes = true;
        }
    }

    $scope.getNumber = function(num) {
        return new Array(num);
    }

})

app.service('asyncService', function($http, $q) {
    return {
        loadDataFromUrls: function(urls) {
            var promises = urls.map(function(url) {

                return $http({
                    url   : url,
                    method: 'get',

                });

            });

            return $q.all(promises);
        }
    };
});