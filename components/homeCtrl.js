angular.module('poiApp')
.controller('homeCtrl', ['$location','$scope','$http','setHeadersToken','localStorageModel','setUser' ,function($location,$scope,$http,setHeadersToken,localStorageModel,setUser) {
    let serverUrl='http://localhost:3000/'
    self=this;
    $scope.catImg=[];
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
            $scope.catImg.push(result2[0].data.images[0].image);
            $scope.catImg.push(result2[1].data.images[0].image);

            

        },function(err){
            alert(err);
        })

    })
}]);

