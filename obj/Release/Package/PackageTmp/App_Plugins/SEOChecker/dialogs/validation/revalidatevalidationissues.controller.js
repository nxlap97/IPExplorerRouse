angular.module("umbraco").controller("seoChecker.RevalidateValidationIssuesController", function ($scope, localizationService, seocheckerBackofficeResources, seocheckerHelper, $timeout) {
    $scope.initialize = function () {
        $scope.parentModel = $scope.model;
        $scope.loaded = false;
        seocheckerBackofficeResources.initializeRevalidateIssues($scope.parentModel.selectedItems).then(function (res) {
            $scope.loaded = true;
            $scope.model = res.data;
            $scope.timer = $timeout($scope.refreshStatus, 1000);
        });
    };
    
    $scope.refreshStatus = function () {
        $scope.timer = $timeout($scope.refreshStatus, 1000);
        seocheckerBackofficeResources.refreshRevalidateIssues($scope.model).then(function (res) {
            $scope.model = res.data;
            if ($scope.model.finished === true) {
                if($scope.parentModel && $scope.parentModel.submit) {
                    $scope.parentModel.submit();
                }
            }
        });
    };

    $scope.onCancel = function () {
        if($scope.parentModel && $scope.parentModel.close) {
            $scope.parentModel.close();
        }
    };

    $scope.$on('$destroy', function () {
        $scope.CancelTimer();
    });

    $scope.CancelTimer = function () {
        $timeout.cancel($scope.timer);
    };

    //Initialize
    $scope.initialize();
});