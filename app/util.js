var Product = function(wooliesProd, colesProduct){
    if(wooliesProd) {
        this.name = wooliesProd.Name;
        this.price = wooliesProd.Price;
        this.img = wooliesProd.MediumImageFile;
        this.id = +new Date();
    }else{
        this.name = colesProduct.m + " " + colesProduct.n ;
        this.price = colesProduct.p1.o;
        this.img  =  "https://shop.coles.com.au" +colesProduct.t;
        this.id = +new Date();

    }
}
var parseResponse = {
    wooliesResp: function wooliesRespObj(products) {
        console.log("util", products.Products);
        var prodList = [] ;
        if(!products || !products.Products)
            return {} ;

        var items = products.Products ;
        for(var i=0;i<items.length;i++)
        {
            var newProd = new Product(items[i].Products[0],null) ;
            prodList.push(newProd);
        }
            return prodList ;
    },
    colesResp: function colesRespObj(products) {
        var prodList = [] ;

        //m n p1 and t
        if(!products)
            return {} ;
        for(var i=0;i<products.length;i++)
        {
            var newProd = new Product(null,products[i]) ;
            prodList.push(newProd);
        }
        return prodList ;
    }


};