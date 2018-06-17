angular.module('poiApp')
.controller('homeCtrl', ['$location','$scope','$http','setHeadersToken','localStorageModel','setUser','$rootScope' ,function($location,$scope,$http,setHeadersToken,localStorageModel,setUser,$rootScope) {
    
    let serverUrl='http://localhost:3000/'
    self=this;
    $scope.sendPOI=function(id){
        $rootScope.$broadcast('poi',id);
    }
    setUser.setUser()
    .then(function(result){
        catImg=[];
        $scope.user=setUser.getUser();
        var arrPromise=[];
        for(var i=0;i<2;i++){
            var url=serverUrl+'POI/MostpopularPOI/'+$scope.user.categories[i]+'/numbers/1';
            arrPromise.push($http.get(url));
        }
         Promise.all(arrPromise)
        .then(function(result){
            var arrPromise2=[];
            for(var i=0;i<2;i++){
                var url2=serverUrl+'POI/'+result[i].data[0].ID;
                arrPromise2.push($http.get(url2));
            }
             Promise.all(arrPromise2)
            .then(function(result2){
                catImg.push({"image":result2[0].data.images[0].image,"ID":result2[0].data.poidetails[0].ID});
                catImg.push({"image":result2[1].data.images[0].image,"ID":result2[1].data.poidetails[0].ID});
                console.log("as");
                $scope.catImg=catImg;
                $scope.showimgs = true;
    
            },function(err){
                alert(err);
            })
            
    
        })
    })



}]);

