angular.module('poiApp')
.controller('loginController', ['$location','$scope','$http','setHeadersToken','localStorageModel' ,function($location,$scope,$http,setHeadersToken,localStorageModel) {
    let serverUrl='http://localhost:3000/'
    self=this;
    $scope.submit_log=function(){
        $http.post(serverUrl + "Users/login", $scope.user)
        .then(function (response) {
            //First function handles success
            self.token = response.data.token;
            setHeadersToken.set(self.token)
            self.addTokenToLocalStorage();
            alert("success");
            

        }, function (response) {
            //Second function handles error
            alert("Something went wrong");
        });
  
    };
    $scope.goToRegister= function () {
        
        $location.path('/register');
     };

    $http.get(serverUrl+'POI/RandomPOI/3/n/3')
    .then(function(response){
        randomImg=[];
        randomImg.push(response.data[0].id);
        randomImg.push(response.data[2].id);
        randomImg.push(response.data[1].id);
        for(var i=0;i<randomImg.length;i++){
            $http.get()
        }

    },function(response){
        alert("something went wrong");
    })

}]);

