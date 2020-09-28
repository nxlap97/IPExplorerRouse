angular.module("umbraco").controller("seoChecker.DeleteRedirectsController", function ($scope, localizationService, seocheckerBackofficeResources, seocheckerHelper) {
    $scope.initializeConfirm = function () {
        $scope.parentModel = $scope.model;
        seocheckerBackofficeResources.initializeDeleteRedirects($scope.parentModel.selectedItems).then(function (res) {
            $scope.model = res.data;
            $scope.loaded = true;
        });
    };
    
    $scope.confirm = function () {
        seocheckerBackofficeResources.bulkDeleteRedirects($scope.model).then(function (res) {
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