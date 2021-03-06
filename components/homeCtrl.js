angular.module('poiApp')
.controller('homeCtrl', ['Authservice','$location','$scope','$http','setHeadersToken','localStorageModel','setUser','$rootScope','dbpoisinit','updatecounter',function(Authservice,$location,$scope,$http,setHeadersToken,localStorageModel,setUser,$rootScope,dbpoisinit,updatecounter) {
    
    let serverUrl='http://localhost:3000/'
    self=this;
    if(!Authservice.check()){
        $location.path('/');
        return;
    }
    $scope.sendPOI=function(id){
        $rootScope.$broadcast('poi',id);
    }
    setUser.setUser()
    .then(function(result){
        catImg=[];
        $scope.user=setUser.getUser();
        $rootScope.user=$scope.user; 
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
                catImg.push({"image":result2[0].data.images[0].image,"ID":result2[0].data.poidetails[0].ID,"name":result2[0].data.poidetails[0].name});
                catImg.push({"image":result2[1].data.images[0].image,"ID":result2[1].data.poidetails[0].ID, "name":result2[1].data.poidetails[0].name});
              
                $scope.catImg=catImg;
                $scope.showimgs = true;
                dbpoisinit.DBinit()
                .then(function(result){
                    updatecounter.update();
                })
                $scope.$apply();
    
            },function(err){
                alert(err);
            })
            
    
        })
        $scope.savedBool=[];
        $http.get(serverUrl+'users/log/2LastSaved')
        .then(function(result3){
            if(result3.data.length===0){
                $scope.savedBool=[false,false];
                return;
            }
            var lastSavedimg=[];
            var arrLastSaved=[];
            for(var i=0;i<result3.data.length;i++){
                var urlSaved=serverUrl+'POI/'+result3.data[i].poiID;
                $scope.savedBool.push(true);
                arrLastSaved.push($http.get(urlSaved));
            }
            Promise.all(arrLastSaved)
            .then(function(result4){
                for(var i=0;i<result4.length;i++){
                    lastSavedimg.push({"image":result4[i].data.images[0].image,"ID":result4[i].data.poidetails[0].ID,"name":result4[i].data.poidetails[0].name});
                }
                $scope.lastSavedimg=lastSavedimg;
                $scope.showimgs = true;
                $scope.$apply();
    
            },function(err){
                alert(err);
            })
        })
    })



}]);

