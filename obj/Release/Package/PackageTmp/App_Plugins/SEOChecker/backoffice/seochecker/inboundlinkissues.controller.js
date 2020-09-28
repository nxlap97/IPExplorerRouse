angular.module("umbraco")
    .controller("seoChecker.inboundlinkissuesController",
    function ($scope, $timeout, $routeParams, notificationsService, editorService, seocheckerBackofficeResources, seocheckerHelper) {
        $scope.loaded = false;
        $scope.bindData = function () {
            seocheckerBackofficeResources.loadAllInBoundLinkErrors($scope.model).then(function (res) {
                $scope.loaded = true;
                $scope.model = res.data;
                seocheckerHelper.syncPath($scope.model.path);
            });
        };

        $scope.save = function () {
            seocheckerBackofficeResources.saveInBoundLinkErrors($scope.model.data).then(function (res) {
                $scope.model = res.data;
                seocheckerHelper.showNotification($scope.model.notificationStatus);
            });
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
            return $scope.model.hasRecords || ($scope.model.filter != null && $scope.model.filter.length > 0);
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

       
        $scope.showDialog = function (item) {
            var dialogOptions = {
                multiPicker: false,
                startNodeId: null,
                submit: function (data) {
                    item.id =  data.selection[0].id;
                    item.name =data.selection[0].name;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    editorService.close();
                },
                close: function close() {
                    editorService.close();
                },
                idType: "int"
            };
            if (item.contentType === 'media') {
                editorService.mediaPicker(dialogOptions);

            } else {

                editorService.contentPicker(dialogOptions);
            }

        };

        $scope.clear = function (item) {
            item.id = null;
            item.name = '';
        };

        $scope.buttonGroup = {
            defaultButton: {
                labelKey: "buttons_save",
                hotKey: "ctrl+s",
                hotKeyWhenHidden: false,
                handler: function() {
                    $scope.save();
                }
            },
            subButtons: [
                {
                    labelKey: "seoCheckerBulkActions_bulkActionClearAllButton",
                    hotKey: "ctrl+d",
                    hotKeyWhenHidden: false,
                    handler: function() {
                        var options = {
                            localizationKey: "seoCheckerBulkActions_bulkActionClearAllConfirmMessage",
                            view: "/app_plugins/seochecker/dialogs/confirm.html",
                            size: "small",
                            submit: function () {
                                seocheckerBackofficeResources.clearInboundLinkIssues().then(function (res) {
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
                    }
                }
            ]
        };

        //Initialize
        $scope.bindData();
    });