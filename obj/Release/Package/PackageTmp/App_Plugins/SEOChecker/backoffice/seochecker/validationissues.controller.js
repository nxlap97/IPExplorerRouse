angular.module("umbraco")
    .controller("seoChecker.validationissuesController",
    function ($scope, $timeout, $routeParams, notificationsService, editorService, seocheckerBackofficeResources, seocheckerHelper) {
        $scope.loaded = false;
        $scope.bindData = function () {
            seocheckerBackofficeResources.validationIssues($scope.model).then(function (res) {
                $scope.loaded = true;
                $scope.model = res.data;
                seocheckerHelper.syncPath($scope.model.path);
            });
        };

        $scope.clearDialog = function () {
            var options = {
                localizationKey: "seoCheckerBulkActions_bulkActionClearAllConfirmMessage",
                view: "/app_plugins/seochecker/dialogs/confirm.html",
                size: "small",
                submit: function () {
                    seocheckerBackofficeResources.clearValidationIssues().then(function (res) {
                        seocheckerHelper.showNotification(res.data);
                        $scope.bindData();
                    });
                    editorService.close();
                },
                close: function () {
                    editorService.close();
                }
            };
            editorService.open(options);
        };

        $scope.filter = function () {
            $scope.bindData();
        };

        $scope.sort = function (column) {
            $scope.model.setSortColumn = column;
            $scope.bindData();
        };

        $scope.setRecordCount = function () {
            $scope.model.resetPaging = true;
            $scope.bindData();
        };

        $scope.goToPage = function (pageNumber) {
            $scope.model.paging.currentPage = pageNumber;
            $scope.bindData();
        };

        $scope.showResult = function () {
            return $scope.model.hasRecords ||($scope.model.filter != null && $scope.model.filter.length > 0);
        };

        $scope.handleSelectAll = function () {
            seocheckerHelper.handleSelectAll($scope.model.selectAll, $scope.model.data);
        };

        $scope.anyItemSelected = function () {
            return seocheckerHelper.anyItemSelected($scope.model.data);
        }

        $scope.isSortDirection = function (columnName, sortDirection) {
            return seocheckerHelper.isSortDirection(columnName, sortDirection, $scope.model.orderByProperty, $scope.model.orderByDirection);
        }

        $scope.deleteSelected = function () {
            var options = {
                selectedItems:  seocheckerHelper.getSelectedItems($scope.model.data),
                view: "/app_plugins/seochecker/dialogs/validation/deletevalidationissues.html",
                size: "small",
                submit: function () {
                    $scope.model.resetPaging = true;
                    $scope.bindData();
                    editorService.close();
                },
                close: function () {
                    editorService.close();
                }
            };
            editorService.open(options);

        };

        $scope.revalidateSelected = function () {
            var options = {
                selectedItems:  seocheckerHelper.getSelectedItems($scope.model.data),
                view: "/app_plugins/seochecker/dialogs/validation/revalidatevalidationissues.html",
                size: "small",
                submit: function () {
                    $scope.model.resetPaging = true;
                    $scope.bindData();
                    editorService.close();
                },
                close: function () {
                    editorService.close();
                }
            };
            editorService.open(options);
        };

        $scope.openDocument = function (id) {
            window.open('/umbraco/#/content/content/edit/' + id, '_blank', 'width = 900, height = 800');
        };
        $scope.openTemplate = function (id) {
            window.open('/umbraco/#/settings/framed/%252Fumbraco%252Fsettings%252Fviews%252FeditView.aspx%253FtreeType%253Dtemplates%2526templateID%253D' + id, '_blank', 'width = 900, height = 800');
        };

        //Initialize
        $scope.bindData();
    });