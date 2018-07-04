angular.module('poiApp')
.controller('forgotCtrl', ['$location','$scope','$http','setHeadersToken','localStorageModel','setUser','$rootScope','dbpoisinit','updatecounter',function($location,$scope,$http,setHeadersToken,localStorageModel,setUser,$rootScope,dbpoisinit,updatecounter) {
    
    let serverUrl='http://localhost:3000/'
    self=this;


    $scope.submit=function(){
        $scope.user.questionID = [];
        $scope.user.questionID[0] = $scope.user.questions[0].questionID;
        $scope.user.questionID[1] = $scope.user.questions[1].questionID;
      
        //post request
        $http.post(serverUrl + "users/passwordRetrieval",$scope.user)
            .then(function(response){
                alert(response.data);
                $location.path('/');
            },function (response){
                alert(response.data);
            }
        );
    };








    $http.get(serverUrl + "users/questionslist")
    .then(function(response){
        $scope.questionslist=response.data
        console.log($scope.questionslist)
    },
    function (response) {
        //Second function handles error
        $scope.questionslist = "Something went wrong";
    });
}]);

