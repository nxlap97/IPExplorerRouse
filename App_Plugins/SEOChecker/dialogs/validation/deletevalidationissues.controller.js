angular.module("umbraco").controller("seoChecker.DeleteValidationIssuesController", function ($scope, localizationService, seocheckerBackofficeResources, seocheckerHelper) {
    $scope.initializeConfirm = function () {
        $scope.parentModel = $scope.model;
        seocheckerBackofficeResources.initializeDeleteValidationIssues($scope.parentModel.selectedItems).then(function (res) {
            $scope.model = res.data;
            $scope.loaded = true;
        });
    };
    // <button ng-click="okClick()">OK</button>

    $scope.confirm = function () {
        seocheckerBackofficeResources.bulkDeleteValidationIssues($scope.model).then(function (res) {
            $scope.model = res.data;
            seocheckerHelper.showNotification($scope.model.notificationStatus);
            if($scope.parentModel && $scope.parentModel.submit) {
                $scope.parentModel.submit();
            }
        });
        
        
    };

   
    $scope.cancel = function () {
        if($scope.parentModel && $scope.parentModel.close) {
            $scope.parentModel.close();
        }
    };

    //Initialize
    $scope.initializeConfirm();
});