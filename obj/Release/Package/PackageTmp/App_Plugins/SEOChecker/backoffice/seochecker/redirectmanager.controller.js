angular.module("umbraco")
    .controller("seoChecker.redirectmanagerController",
    function ($scope, $timeout, $routeParams, notificationsService, editorService, seocheckerBackofficeResources, seocheckerHelper) {
        $scope.loaded = false;
        $scope.bindData = function () {
            seocheckerBackofficeResources.loadAllRedirects($scope.model).then(function (res) {
                $scope.loaded = true;
                $scope.model = res.data;
                seocheckerHelper.syncPath($scope.model.path);
            });
        };
        $scope.doExport = function (model) {
            var url = seocheckerBackofficeResources.getRedirectExportUrl(model);
            seocheckerHelper.downloadFile(url);
        }

        $scope.doImport = function (model) {
            seocheckerBackofficeResources.importRedirects(model).then(function (res) {
                
            });
        }


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
            return $scope.model.hasRecords ||  ($scope.model.filter!= null && $scope.model.filter.length > 0);
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
                selectedItems: seocheckerHelper.getSelectedItems($scope.model.data),
                view: "/app_plugins/seochecker/dialogs/redirects/deleteredirects.html",
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

        $scope.editRedirect = function (id) {
            var options = {
                redirectid: id,
                view: "/app_plugins/seochecker/dialogs/redirects/editredirects.html",
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
        

        $scope.buttonGroup = {
            defaultButton: {
                labelKey: "seoCheckerRedirectManager_createButton",
                hotKey: "ctrl+n",
                hotKeyWhenHidden: true,
                handler: function() {
                    $scope.editRedirect('0');
                }
            },
            subButtons: [
                {
                    labelKey: "seoCheckerExportRedirects_exportOptionButton",
                    hotKey: "ctrl+e",
                    hotKeyWhenHidden: true,
                    handler: function() {
                        var options = {
                            view: "/app_plugins/seochecker/dialogs/redirects/exportredirects.html",
                            size: "small",
                            submit: function (model) {
                                if (model != null) {
                                    $scope.doExport(model);
                                }
                                editorService.close();
                            },
                            close: function () {
                                editorService.close();
                            }
                        };
                        editorService.open(options);
                    }
                },
                 {
                     labelKey: "seoCheckerImportRedirects_importOptionButton",
                     hotKey: "ctrl+i",
                     hotKeyWhenHidden: true,
                     handler: function () {
                         var options = {
                             view: "/app_plugins/seochecker/dialogs/redirects/importredirects.html",
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
                     }
                 }
            ]
        };

        //Initialize
        $scope.bindData();
    });