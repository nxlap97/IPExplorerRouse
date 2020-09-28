angular.module("umbraco").controller("seoChecker.ExportRedirectsController", function ($scope, localizationService, seocheckerBackofficeResources, seocheckerHelper) {
    $scope.initializeExport = function () {
        $scope.parentModel = $scope.model;
        seocheckerBackofficeResources.initializeExportRedirects($scope.dialogData).then(function (res) {
            $scope.model = res.data;
            $scope.loaded = true;
        });
    };

    $scope.export = function () {
        
        seocheckerBackofficeResources.exportRedirects($scope.model).then(function (res) {
            $scope.model = res.data;
            if (!$scope.model.isInValid) {
                $scope.parentModel.submit($scope.model);
            }
        });
    };

    $scope.onCancel = function () {
        if($scope.parentModel && $scope.parentModel.close) {
            $scope.parentModel.close();
        }
    };

    //Initialize
    $scope.initializeExport();
});