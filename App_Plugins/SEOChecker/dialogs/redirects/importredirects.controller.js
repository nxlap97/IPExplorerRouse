angular.module("umbraco").controller("seoChecker.ImportRedirectsController", function ($scope, localizationService, seocheckerBackofficeResources, seocheckerHelper, fileManager, $http, $rootScope) {
    $scope.initializeImport = function () {
        $scope.parentModel = $scope.model;
        seocheckerBackofficeResources.initializeImportRedirects(null).then(function (res) {
            $scope.model = res.data;
            $scope.loaded = true;
            
        });
    };

    $scope.updateModel = function () {
        seocheckerBackofficeResources.redirectUpdateModel($scope.model).then(function (res) {
            $scope.model = res.data;
            $scope.loaded = true;

        });
    };

    $scope.import = function () {
        seocheckerBackofficeResources.importRedirects($scope.model).then(function (res) {
            $scope.model = res.data;
            $scope.loaded = true;

        });
    };

    $scope.exportErrors = function () {
        var url = seocheckerBackofficeResources.getExportRedirectErrorsUrl($scope.model);
        seocheckerHelper.downloadFile(url);
    };

    $rootScope.$on("seodropdown.changed", function (event, data) {
        if (data.alias === 'worksheet') {
            $scope.model.resetWorksheet = true;
            $scope.updateModel();
        }
        if (data.alias === 'importProvider') {
            seocheckerBackofficeResources.initializeImportRedirects($scope.model).then(function (res) {
                $scope.model = res.data;
                $scope.loaded = true;
            
            });
        }
    });

    $scope.upload = function () {
        var fileInput = document.getElementById('uploadSeoFile');
         seocheckerHelper.uploadFiles('redirectimport', fileInput.files[0], function(res) {
             $scope.model.importFileInfo = JSON.parse(res);
             $scope.updateModel();
         });
    };

    $scope.showUploadButton = function () {
        return angular.isObject($scope.model) &&  $scope.model.fileSelected === false;
    };

    $scope.showImportButton = function () {
        return angular.isObject($scope.model) && $scope.model.fileSelected === true && $scope.model.fileImported === false;
    };

    $scope.showResult = function () {
        return angular.isObject($scope.model) && $scope.model.fileImported === true;
    };

    $scope.hasImportErrors = function () {
        return angular.isObject($scope.model) && $scope.model.importErrors > 0;
    };

    $scope.getTabByName = function(tabName)
    {
        if (angular.isUndefined($scope.model) ||angular.isUndefined($scope.model.tabs)) {
            return {};
        }
        return seocheckerHelper.getTabByName($scope.model.tabs, tabName);
    }

    $scope.onCancel = function () {
        if($scope.parentModel && $scope.parentModel.close) {
            $scope.parentModel.close();
        }
    };

    $scope.close = function () {
        if($scope.parentModel && $scope.parentModel.close) {
            $scope.parentModel.submit();
        }
    };

    //Initialize
    $scope.initializeImport();
});