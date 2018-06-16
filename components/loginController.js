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
            $scope.user.startname=$scope.user.username;
            $http.post(serverUrl + "Users/log")
            .then(function(result){
                $scope.user.username=result.data.username;
                $scope.user.firstname=result.data.FirstName;
                $scope.user.lastame=result.data.LastName;
                $scope.user.city=result.data.City;
                $scope.user.country=result.data.Country;
                $scope.user.email=result.data.Email;
                $scope.user.categories=result.data.categories;
                $location.path('/home');
            })
            

        }, function (response) {
            //Second function handles error
            alert(response.data);
        });
  
    };
    self.addTokenToLocalStorage = function () {
        token = localStorageModel.getLocalStorage('token');
        if(token == undefined)
            localStorageModel.addLocalStorage('token', self.token);
        else
            localStorageModel.updateLocalStorage('token',self.token);
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
        alert(response.data);
    })

}]);

