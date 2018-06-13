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
    self.addTokenToLocalStorage = function () {
        localStorageModel.addLocalStorage('token', self.token)
    }; 
    $scope.goToRegister= function () {
        
        $location.path('/register');
     };

    $http.get(serverUrl+'POI/RandomPOI/3/n/3')
    .then(function(response){
        data = response.data
        randomImg=[];
        randomImg.push(data[0][0].image);
        randomImg.push(data[2][0].image);
        randomImg.push(data[1][0].image);
        $scope.randomImg = randomImg;
    },function(response){
        alert("something went wrong");
    })

}]);

