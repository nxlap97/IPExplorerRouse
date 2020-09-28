angular.module("umbraco")
    .controller("cmsimport.dashboardController",
    function ($scope, $rootScope, $routeParams,$route, notificationsService, editorService, cmsimportBackofficeResources, cmsimportHelper) {
        $scope.bindData = function () {

            cmsimportBackofficeResources.initializeDashboard().then(function (res) {
                $scope.model = res.data;
                $scope.loaded = true;
                //cmsimportHelper.syncPath($scope.model.path);

            },
                function (data) {
                    cmsimportHelper.showServerError();
                });
        };

        $scope.upload = function () {
            var fileInput = document.getElementById('selectLicenseFile');
            cmsimportHelper.uploadFiles('uploadlicense', fileInput.files[0],function (fileInfo) {
                cmsimportBackofficeResources.processLicenseFile(fileInfo).then(function (res) {
                    var uploadedModel = res.data;
                    cmsimportHelper.showNotification(uploadedModel.notificationStatus);
                    $route.reload();
                });
            });
        };

        //Initialize
        $scope.bindData();
    });
angular.module("umbraco")
    .controller("cmsimport.deleteController",
        function ($scope, cmsimportBackofficeResources, notificationsService, treeService, navigationService) {

            $scope.performDelete = function () {

                //mark it for deletion (used in the UI)
                $scope.currentNode.loading = true;

                treeService.removeNode($scope.currentNode);

                cmsimportBackofficeResources.deleteTreeNodeById($scope.currentNode.id).then(function () {
                    $scope.currentNode.loading = false;
                    notificationsService.success('Deleted', 'Definition ' + $scope.currentNode.name + ' is deleted');
                    navigationService.hideMenu();
                });

            };

            $scope.cancel = function () {
                navigationService.hideDialog();
            };
        });
angular.module("umbraco")
    .controller("cmsimport.wizardController",
        function ($scope, $rootScope, $routeParams, $q, notificationsService, editorService, cmsimportBackofficeResources, cmsimportHelper) {

            $scope.bindData = function () {
                cmsimportBackofficeResources.initializeWizard($routeParams.id).then(function (res) {
                    $scope.model = res.data;
                    $scope.loaded = true;
                    cmsimportHelper.syncPath($scope.model.path);
                    $scope.setNextAction();

                },
                    function (data) {
                        cmsimportHelper.showServerError();
                    });
            };


            $scope.upload = function (data) {
                var deferred = $q.defer();
                var items = [];
                for (i = 0; i < data.length; i++) {
                    items.push(data[i]);
                }
                deferred.resolve(items);
                return deferred.promise;
            }

            $scope.setNextAction = function () {
                $rootScope.next = function () {
                    cmsimportBackofficeResources.goNext($scope.model).then(function (res) {
                        $scope.model = res.data;
                        if ($scope.model.currentStep.stepAlias === "step6") {
                            $scope.frm.$setPristine();
                        }
                    },
                        function (data) {
                            cmsimportHelper.showServerError();
                        });
                };
            };

            $scope.goNext = function () {
                $rootScope.next();
            };

            $scope.goPrevious = function () {
                cmsimportBackofficeResources.goPrevious($scope.model).then(function (res) {
                    $scope.model = res.data;
                },
                    function (data) {
                        cmsimportHelper.showServerError();
                    });
            };

            $scope.save = function () {
                var options = {
                    view: "/app_plugins/cmsimport/dialogs/savedefinitiondialog.html",
                    size: "small",
                    stateId: $scope.model.stateId,
                    parentStateId: $scope.model.parentStateId,
                    submit: function (saveModel) {
                        $scope.model.stateId = saveModel.definitionId;
                        $scope.model.stateName = saveModel.name;
                        cmsimportBackofficeResources.saveDefinitionModel($scope.model).then(function (res) {
                            cmsimportHelper.syncPath(res.data.path);
                            cmsimportHelper.showNotification(res.data.notificationStatus);
                            $scope.frm.$setPristine();
                        },
                            function (data) {
                                cmsimportHelper.showServerError();
                            });
                        editorService.close();
                    },
                    close: function () {
                        editorService.close();
                    }
                };
                editorService.open(options);
            };


            $scope.updateModel = function () {
                cmsimportBackofficeResources.updateModel($scope.model).then(function (res) {
                    var updatedModel = res.data;
                    var stepAlias = updatedModel.currentStep.stepAlias;
                    cmsimportHelper.updateTab($scope.model, updatedModel, stepAlias);
                },
                    function (data) {
                        cmsimportHelper.showServerError();
                    });
            };

            $rootScope.$on("cmsimportBooleanCheckbox.changed", function (event, data) {
                $scope.updateModel();
            });

            $rootScope.$on("cmsimportDropdown.changed", function (event, data) {
                $scope.updateModel();
            });

            $rootScope.$on("cmsimportPageTitle.changed", function (event, data) {
                $scope.model.currentStep.stepTitle = data.title;
                $scope.model.currentStep.stepIntro = data.description;
            });

            $rootScope.upload = function () { };

            //Initialize
            $scope.bindData();

        });
angular.module("umbraco")
    .controller("cmsimport.mailSettingsController",
        function ($scope, $routeParams, notificationsService, editorService, cmsimportBackofficeResources, cmsimportHelper) {
            $scope.bindData = function () {

                cmsimportBackofficeResources.initializeEmailSettings($routeParams.id).then(function (res) {
                        $scope.model = res.data;
                        $scope.loaded = true;
                        cmsimportHelper.syncPath($scope.model.path);
                    },
                    function (data) {
                        cmsimportHelper.showServerError();
                    });
            };

            $scope.save = function () {
                cmsimportBackofficeResources.saveEmailSettings($scope.model).then(function (res) {
                        $scope.model = res.data;
                        if (!$scope.model.isInValid) {
                            $scope.frm.$setPristine();
                            cmsimportHelper.showNotification($scope.model.notificationStatus);
                        }
                    },
                    function (data) {
                        cmsimportHelper.showServerError();
                    });
            };

            //Initialize
            $scope.bindData();
        });
angular.module("umbraco")
    .controller("cmsimport.dashboardSettingsController",
        function ($scope, $routeParams, notificationsService, editorService, cmsimportBackofficeResources, cmsimportHelper) {
            $scope.bindData = function () {

                cmsimportBackofficeResources.initializeDashboardSettings().then(function (res) {
                        $scope.model = res.data;
                        $scope.loaded = true;
                        cmsimportHelper.syncPath($scope.model.path);
                    },
                    function (data) {
                        cmsimportHelper.showServerError();
                    });
            };

            $scope.save = function () {
            	cmsimportBackofficeResources.saveDashboardSettings($scope.model).then(function (res) {
                        $scope.model = res.data;
                        if (!$scope.model.isInValid) {
                            $scope.frm.$setPristine();
                            cmsimportHelper.showNotification($scope.model.notificationStatus);
                        }
                    },
                    function (data) {
                        cmsimportHelper.showServerError();
                    });
            };

            //Initialize
            $scope.bindData();
        });
angular.module("umbraco")
    .controller("cmsimport.mediaSettingsController",
        function ($scope, $rootScope,$routeParams, notificationsService, editorService, cmsimportBackofficeResources, cmsimportHelper) {
            $scope.bindData = function () {

                cmsimportBackofficeResources.initializeMediaSettings().then(function (res) {
                        $scope.model = res.data;
                        $scope.loaded = true;
                        cmsimportHelper.syncPath($scope.model.path);
                    },
                    function (data) {
                        cmsimportHelper.showServerError();
                    });
            };

            $scope.save = function () {
                cmsimportBackofficeResources.saveMediaSettings($scope.model).then(function (res) {
                        var model = res.data;
                        if (!model.isInValid) {
                            $scope.frm.$setPristine();
                            cmsimportHelper.showNotification(model.notificationStatus);
                        }
                    },
                    function (data) {
                        cmsimportHelper.showServerError();
                    });
            };
            
            //Initialize
            $scope.bindData();
        });
angular.module("umbraco").controller("cmsimport.ScheduleDialogController",
    function ($scope, $rootScope, $routeParams, cmsimportBackofficeResources, cmsimportHelper) {

        $scope.initializeDialog = function () {
            $scope.loaded = true;
            $scope.parentModel = $scope.model;
            cmsimportBackofficeResources.initializeScheduledTask($routeParams.id).then(function (res) {
                $scope.model = res.data;
                $scope.loaded = true;
                cmsimportHelper.syncPath($scope.model.path);
            });
            $scope.loaded = true;
        };

        $scope.updateModel = function () {
            cmsimportBackofficeResources.updateScheduledTask($scope.model).then(function (res) {
                    $scope.model = res.data;
                },
                function (data) {
                    cmsimportHelper.showServerError();
                });
        };

        $scope.save = function () {
            cmsimportBackofficeResources.saveScheduledTask($scope.model).then(function (res) {
                $scope.model = res.data;
                cmsimportHelper.syncPath($scope.model.path);
                cmsimportHelper.showNotification($scope.model.notificationStatus);
                $scope.frm.$setPristine();
            });
        };

        $scope.onCancel = function () {
            $scope.parentModel.close();
        };

        $rootScope.$on("cmsimportBooleanCheckbox.changed", function (event, data) {
            $scope.updateModel();
        });

        $rootScope.$on("cmsimportDropdown.changed", function (event, data) {
            $scope.updateModel();
        });

        $rootScope.$on("cmsimportRadioButton.changed", function (event, data) {
            $scope.model.selectRadioOption = data.alias;
            $scope.updateModel();
        });

        //Initialize
        $scope.initializeDialog();
});
angular.module("umbraco").controller("cmsimport.ScheduleLogController",
    function ($scope, editorService, $routeParams, cmsimportBackofficeResources, cmsimportHelper) {

        $scope.initialize= function () {
            cmsimportBackofficeResources.initializeScheduledLog($routeParams.id).then(function (res) {
                $scope.model = res.data;
                $scope.loaded = true;
                cmsimportHelper.syncPath($scope.model.path);
            });
        };

        $scope.clearLog = function () {
            var options = {
                localizationKey: "cmsimportScheduledTaskLog_confirmMessage",
                view: "/app_plugins/cmsimport/dialogs/confirm.html",
                size: "small",
                submit: function () {
                    cmsimportBackofficeResources.clearScheduledLog($routeParams.id).then(function (res) {
                        $scope.model = res.data;
                        cmsimportHelper.showNotification($scope.model.notificationStatus);
                    });
                    editorService.close();
                },
                close: function () {
                    editorService.close();
                }
            };
            editorService.open(options);
        };
        

        //Initialize
        $scope.initialize();
    });
angular.module("umbraco").controller("cmsimport.ConfirmDialogController", function ($scope, localizationService) {

    $scope.initializeConfirm = function () {
        localizationService.localize($scope.model.localizationKey).then(function (value) {
            $scope.confirmCaption = value;
        });
    };

    $scope.confirm = function () {
        if ($scope.model && $scope.model.close) {
            $scope.model.submit();
        }
    };

    $scope.cancel = function () {
        if ($scope.model && $scope.model.close) {
            $scope.model.close();
        }
    };

    //Initialize
    $scope.initializeConfirm();
});
angular.module("umbraco").controller("cmsimport.SaveDefinitionController", function ($scope,  cmsimportBackofficeResources) {
    $scope.initializeSave = function () {
        $scope.loaded = true;
        $scope.parentModel = $scope.model;
        cmsimportBackofficeResources.initializeDefinitionSave($scope.parentModel.stateId, $scope.parentModel.parentStateId).then(function (res) {
            $scope.model = res.data;
            $scope.loaded = true;
        });
        $scope.loaded = true;
    };

    $scope.save = function () {
        cmsimportBackofficeResources.validateDefinitionSaveModel($scope.model).then(function (res) {
            $scope.model = res.data;
            if (!$scope.model.isInValid) {
                $scope.parentModel.submit($scope.model);
            }
        });
    };

    $scope.onCancel = function () {
        $scope.parentModel.close();
    };

    //Initialize
    $scope.initializeSave();
});
angular.module("umbraco.directives")
    .directive('file', function() {
    return {
        require:"ngModel",
        restrict: 'A',
        link: function($scope, el, attrs, ngModel){
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];

                ngModel.$setViewValue(file,event);
                $scope.$apply();
            });
        }
    };
});
angular.module("umbraco.directives")
    .directive('cmsimportLicenseinfo', function (cmsimportBackofficeResources) {
        return {
            transclude: true,
            restrict: 'E',
            replace: true,
            link: function (scope, element) {
                cmsimportBackofficeResources.getLicenseInfo().then(function (res) {
                    if (res.data.licenseError === true) {
                        element.html('<div class="alert alert-error cmsimportLicenseInfo">' + res.data.licenseMessage + '</div>');
                    }
                    if (res.data.trialLicense === true) {
                        element.html('<div class="alert alert-warning cmsimportLicenseInfo">' + res.data.licenseMessage + '</div>');
                    }
                });
            }
        };
    });
angular.module("umbraco")
    .controller("cmsimport.TemplateEditorFieldController",
        function ($scope,assetsService) {

            assetsService.loadCss('lib/ace-razor-mode/theme/razor_chrome.css', $scope);
            $scope.aceConfig = {
                "mode": "razor",
                "theme": "chrome",
                "showPrintMargin": false,
                "advanced": {
                    "fontSize": "14px",
                    "enableSnippets": false,
                    "enableBasicAutocompletion": true,
                    "enableLiveAutocompletion": false
                }
            }
        });
angular.module("umbraco")
    .controller("cmsimport.MemberPickerController",
        function($scope, editorService, memberGroupResource, cmsimportBackofficeResources ) {

            $scope.pickGroup = function() {
                editorService.memberGroupPicker({
                    multiPicker: true,
                    submit: function(model) {
                        var selectedGroupIds = _.map(model.selectedMemberGroups
                            ? model.selectedMemberGroups
                            : [model.selectedMemberGroup],
                            function(id) { return parseInt(id) }
                        );
                        var selected = [];
                        memberGroupResource.getByIds(model.selectedMemberGroups).then(function(selectedGroups) {
                            _.each(selectedGroups,
                                function(group) {
                                    selected.push(group.name);

                                });
                            $scope.model.value = selected;
                        });
                        editorService.close();
                    },
                    close: function() {
                        editorService.close();
                    }
                });
            };

            $scope.removeGroup = function(group) {
                cmsimportBackofficeResources.removeMultiStringFieldItem($scope.model.value, group).then(function(res) {
                        $scope.model.value = res.data;
                    },
                    function(data) {
                        cmsimportHelper.showServerError();
                    });
            };
        });
angular.module("umbraco")
    .controller("cmsimport.propertyMappingController",
        function ($scope, cmsimportHelper) {

            $scope.toggleForm = function (item) {
                item.showAdvancedOptionsForm = !item.showAdvancedOptionsForm;
            };

            $scope.isMapped = function(item) {
                return !cmsimportHelper.isNullOrEmptyString(item.mappedDataSourceColumn);
            };

            $scope.showAdvancedOptionsOption = function (item) {
                return !cmsimportHelper.isNullOrUndefined(item.advancedOptions) && $scope.isMapped(item);
            };

            $scope.showAdvancedOptionsForm = function (item) {
                return item.showAdvancedOptionsForm && $scope.isMapped(item);
            };
        });
angular.module("umbraco")
    .controller("cmsimport.booleanController",
        function ($scope,$rootScope) {
            $scope.itemChanged = function (item) {
                item.value = !item.value;
                $rootScope.$broadcast("cmsimportBooleanCheckbox.changed", { alias: item.alias, value: item.value });
            };
        });

angular.module("umbraco")
    .controller("cmsimport.radioButtonListController",
        function ($scope, $rootScope) {
            $scope.itemChanged = function (item) {
                $rootScope.$broadcast("cmsimportRadioButton.changed", { alias: item.name, value: item.value });
            };
        });
angular.module("umbraco")
    .controller("cmsimport.timeSelectorController",
        function ($scope) {

            $scope.bindData = function () {

                $scope.hours = [];
                for (var h = 0; h < 24; h++) {
                    $scope.hours.push(h);
                }

                $scope.minutes = [];
                for (var m = 0; m < 60; m++) {
                    $scope.minutes.push(m);
                }
            };

            //Initialize
            $scope.bindData();

        });
angular.module("umbraco")
    .controller("cmsimport.multiStringController",
    function ($scope, $rootScope, cmsimportBackofficeResources, cmsimportHelper) {
        $scope.newItem = '';

        $scope.addItem = function (fieldAlias, item) {
            cmsimportBackofficeResources.addMultiStringFieldItem($scope.model.value, item).then(function (res) {
                if (!$scope.model.isInValid) {
                    $scope.model.value = res.data;
                    $scope.newItem = '';
                    $rootScope.$broadcast("cmsimportMultistring.added", { alias: fieldAlias, value: item });
                }
            },
                function (data) {
                    cmsimportHelper.showServerError();
                });
        };

        $scope.removeItem = function (fieldAlias, item) {

            cmsimportBackofficeResources.removeMultiStringFieldItem($scope.model.value, item).then(function (res) {
                    if (!$scope.model.isInValid) {
                        $scope.model.value = res.data;
                        $scope.newItem = '';
                        $rootScope.$broadcast("cmsimportMultistring.removed", { alias: fieldAlias, value: item });
                    }
                },
                function (data) {
                    cmsimportHelper.showServerError();
                });

            
        };
    });
angular.module("umbraco")
    .controller("cmsimport.datasourcePickerController",
        function ($scope, $rootScope, cmsimportHelper) {

            $scope.init = function() {
                $scope.selectedfileName = $scope.model.value.uploadedFile.fileName;
            };

            $scope.uploadChanged = function () {
                var fileInput = document.getElementById('selectDatasourceFile');
                $scope.selectedfileName = fileInput.files[0].name;
                $scope.nextfn = $rootScope.next;
                $rootScope.next = function() {
                    $scope.upload();
                };
            };

            $rootScope.upload = function() {
                $scope.upload();
            };

            $scope.switchUrl = function() {
                $scope.model.value.pickerType = 'urlPicker';
            };
            
            $scope.switchUpload = function() {
                $scope.model.value.pickerType = 'filePicker';
            };

            $scope.upload = function () {
                var fileInput = document.getElementById('selectDatasourceFile');
              
                cmsimportHelper.uploadFiles('datasourceFile', fileInput.files[0], function(res) {
                    var fileInfo = JSON.parse(res);
                    fileInfo.fileChanged = true;
                    $scope.model.value.uploadedFile = fileInfo;
                    $scope.selectedfileName = fileInfo.fileName;
                    $rootScope.next = $scope.nextfn;
                    $rootScope.next();
                });
            };

            $scope.init();
        });

angular.module("umbraco")
    .controller("cmsimport.dropdownSelectorController",
        function ($scope, $rootScope) {
            $scope.itemChanged = function (item) {
                $rootScope.$broadcast("cmsimportDropdown.changed", { alias: item.alias, value: item.value.selectedItem });
            };
        });

angular.module("umbraco")
    .controller("cmsimport.importController",
        function ($scope, $rootScope,localizationService,overlayService,editorService, cmsimportBackofficeResources, cmsimportHelper) {
            $scope.openStartImport = function() {
                // Open discard changes overlay
                var overlay = {
                    "view": "/app_plugins/cmsimport/overlays/importoverlay.html",
                    "title": "Importing please wait",
                    "importStatus": $scope.model.value,
                    "disableBackdropClick": true,
                    "hideSubmitButton": true,
                    "closeButtonLabel": "Cancel",
                    submit: function (result) {
                        $scope.importResult = result;
                        $rootScope.$broadcast("cmsimportPageTitle.changed", { title: $scope.importResult.importFinishedTitle, description: $scope.importResult.importFinishedDescription });
                        // close all editors
                        editorService.closeAll();
                        overlayService.close();
                    },
                    close: function () {
                        cmsimportBackofficeResources.cancel($scope.model.value).then(function (res) {
                            $scope.model.importStatus = res.data;
                            $scope.importResult = $scope.model.importStatus.result;
                            $rootScope.$broadcast("cmsimportPageTitle.changed", { title: $scope.importResult.importFinishedTitle, description: $scope.importResult.importFinishedDescription });
                        });
                    }
                };

                overlayService.open(overlay);
            };

            $scope.openStartImport();
        });

angular.module("umbraco.resources")
    .factory("cmsimportBackofficeResources", function ($http) {
        return {
            //LicenseInfo
            getLicenseInfo: function () {
                return $http.get("backoffice/cmsimport/cmsimportdashboardapi/licenseinfo");
            },
            initializeDashboard: function () {
                return $http.get("backoffice/cmsimport/cmsimportdashboardapi/initialize");
            },
            processLicenseFile: function (fileInfo) {
                return $http.post("backoffice/cmsimport/cmsimportdashboardapi/processlicense", fileInfo);
            },
            uploadFiles: function (formData) {
                return $http.post("backoffice/cmsimport/fileuploadapi/upload",
                    formData,
                    {
                        transformRequest: angular.identity,
                        headers: {
                            "Content-Type": undefined
                        }
                    });
            },
            //form
            initializeWizard: function (id) {
                return $http.get("backoffice/cmsimport/cmsimportwizardapi/initialize", { params: { id: id } });
            },
            goNext: function (model) {
                return $http.post("backoffice/cmsimport/cmsimportwizardapi/gonextstep",model);
            },
            goPrevious: function (model) {
                return $http.post("backoffice/cmsimport/cmsimportwizardapi/gopreviousstep",model);
            },
            updateModel: function (model) {
                return $http.post("backoffice/cmsimport/cmsimportwizardapi/updatemodel",model);
            },
            initializeDefinitionSave: function (definitionid,parentId) {
                return $http.get("backoffice/cmsimport/cmsimportwizardapi/initializeSave?definitionid=" + definitionid + "&parentId=" + parentId);
            },
            validateDefinitionSaveModel: function (model) {
                return $http.post("backoffice/cmsimport/cmsimportwizardapi/validateSaveOptions", model);
            },
            saveDefinitionModel: function (model) {
                return $http.post("backoffice/cmsimport/cmsimportwizardapi/save", model);
            },
            //Scheduler
            initializeScheduledLog: function(id) {
                return $http.get("backoffice/cmsimport/cmsimportschedulerapi/initializelog", { params: { id: id } });
            },
            clearScheduledLog: function (id) {
                return $http.get("backoffice/cmsimport/cmsimportschedulerapi/clearlog", { params: { id: id } });
            },
            initializeScheduledTask: function (id) {
                return $http.get("backoffice/cmsimport/cmsimportschedulerapi/initialize", { params: { id: id } });
            },
            updateScheduledTask: function (model) {
                return $http.post("backoffice/cmsimport/cmsimportschedulerapi/updatemodel", model);
            },
            saveScheduledTask: function (model) {
                return $http.post("backoffice/cmsimport/cmsimportschedulerapi/save", model);
            },
            //Email settings
            initializeEmailSettings: function (emailTemplate) {
                return $http.get("backoffice/cmsimport/emailsettingsapi/initialize",
                    { params: { emailConfig: emailTemplate } });
            },
            saveEmailSettings: function (emailConfig) {
                return $http.post("backoffice/cmsimport/emailsettingsapi/save", emailConfig);
            },
            //Dashboard settings
            initializeDashboardSettings: function () {
                return $http.get("backoffice/cmsimport/cmsimportdashboardsettingsapi/initialize");
            },
            saveDashboardSettings: function (config) {
                return $http.post("backoffice/cmsimport/cmsimportdashboardsettingsapi/save", config);
            },
            //Media settings
            initializeMediaSettings: function () {
                return $http.get("backoffice/cmsimport/cmsimportgeneralsettingsapi/initialize");
            },
            saveMediaSettings: function (config) {
                return $http.post("backoffice/cmsimport/cmsimportgeneralsettingsapi/save", config);
            },
            //multistring field
            addMultiStringFieldItem: function (currentValues, valueToAdd) {
                var model = { 
                    items : currentValues,
                    itemToUpdate : valueToAdd
                };

                return $http.post("backoffice/cmsimport/multistringfieldapi/additem",model);
            },
            removeMultiStringFieldItem: function (currentValues, valueToremove) {
                var model = { 
                    items : currentValues,
                    itemToUpdate : valueToremove
                };

                return $http.post("backoffice/cmsimport/multistringfieldapi/removeitem",model);
            },
            //General
            deleteTreeNodeById: function (id) {
                return $http.get("backoffice/cmsimport/cmsimporttreeapi/deleteTreeNode?id="+id);
            },
            //import
            startImport: function (model) {
                return $http.post("backoffice/cmsimport/cmsimportimportapi/start", model);
            },
            getStatus: function (model) {
                return $http.post("backoffice/cmsimport/cmsimportimportapi/getstatus", model);
            }
            ,
            cancel: function (model) {
                return $http.post("backoffice/cmsimport/cmsimportimportapi/cancel", model);
            }
        };
    });
angular.module('umbraco.services')
.factory('cmsimportHelper', function (notificationsService, navigationService, cmsimportBackofficeResources, $timeout) {
    var service = {
        showNotification: function (notificationStatus) {
            if (notificationStatus.isError === false) {
                notificationsService.success(notificationStatus.header, notificationStatus.description);
            } else {
                notificationsService.error(notificationStatus.header, notificationStatus.description);
            }
        },
        showServerError: function () {
            notificationsService.error("Server error", "A server error occured");
        }
        ,
        applyValidationErrors: function (source, target) {
            target.isInValid = source.isInValid;
            target.validationMessages = source.validationMessages;
        }

        ,
        syncPath: function (path) {
            navigationService.syncTree({ tree: 'cmsimport', path: path, forceReload: true  });
        },
        isSortDirection: function (columnName, sortDirection, currentSortColumn, currentSortDirection) {
            return columnName === currentSortColumn && sortDirection === currentSortDirection;
        }
        ,
        handleSelectAll: function (selected, items) {
            angular.forEach(items, function (item) {
                item.selected = selected;
            });
        }
          ,
        getSelectedItems: function (items) {
            var result = [];
            angular.forEach(items, function (item) {
                if (item.selected === true) {
                    result.push(item);
                }
            }
          );
            return result;
        }
        ,
        getSelectedIds: function (items, primaryKeyColumn) {
            var result = [];
            angular.forEach(items, function (item) {
                    if (item.selected === true) {
                        result.push(service.getItemByName(item,primaryKeyColumn));
                    }
                }
            );
            return result;
        },
        anyItemSelected: function (items) {
            var result = false;

            angular.forEach(items, function (item) {
                if (item.selected === true) {
                    result = true;
                    return;
                }
            }
           );
            return result === true;
        },
        downloadFile: function (url) {
            var redirectExport = document.createElement('a');
            redirectExport.id = "downloadframe";
            redirectExport.style.display = 'none';
            document.body.appendChild(redirectExport);
            redirectExport.href = url;
            redirectExport.click();
            //remove all traces
            $timeout(function () {
                document.body.removeChild(redirectExport);
            }, 1000);
        }
        ,
        uploadFiles: function (folder, file, cb) {
            var formData = new FormData();
            formData.set("folderName",folder);
            formData.set("file", file, file.name);

            // Http Request  since angular fails
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    cb(request.responseText);
                }
            }

            request.open('POST', "backoffice/cmsimport/fileuploadapi/upload");
            request.send(formData);
        }
          ,
        getItemByName: function (items, alias) {
            var keys = Object.entries(items);
            for (var i = 0; i < keys.length; i++) {
                if (keys[i][0] === alias) {
                    var value = keys[i][1];
                    return  value;
                }
            }

            return null;
        },
        getTabByAlias: function (tabs, alias) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].alias === alias) {
                    return tabs[i];
                }
            }

            //just return an empty tab when nothing is found
            return {
                active: false,
                alias: 'emptyTab',
                id: -1,
                label: 'empty',
                properties: []
            };
        }
        ,
        updateTab: function (oldModel, newModel, tabAlias) {

            var newtab = service.getTabByAlias(newModel.tabs, tabAlias);
            var oldTabs = service.getTabByAlias(oldModel.tabs, tabAlias);

            oldTabs.properties = newtab.properties;
        },
        isNullOrUndefined: function(val) {
            return  val === null || angular.isUndefined(val);
        },
        isNullOrEmptyString: function (val) {
            return val === null || angular.isUndefined(val) || val ==='';
        },
        formatDate: function (value) {
            var isAlreadyFormatted = /\d{4}-\d{2}-\d{2}$/.test(value);

            if (isAlreadyFormatted) {
                return value;
            } if (value && value instanceof Date) {
                return moment(value).format('YYYY-MM-DD');
            } else if (value) {
                var parsedDate = utils.parseDate(value);

                if (parsedDate) {
                    return moment(parsedDate).format('YYYY-MM-DD');
                }
            }
        },
        parseDate: function (value) {
            if (value && value.indexOf('0001-01-01') < 0) {
                var parsedDate = value.replace('T', ' ').replace('Z', '');

                return new Date(Date.parse(parsedDate));
            }
        }
    };
    return service;
});

angular.module("umbraco")
    .controller("cmsimport.importOverlayController",
        function ($scope, $timeout,cmsimportBackofficeResources,overlayService) {

            $scope.start = function() {
                cmsimportBackofficeResources.startImport($scope.model.importStatus);
                $scope.timer = $timeout($scope.getStatus, 1000);
            };

            $scope.getStatus = function () {
                $scope.CancelTimer();
                cmsimportBackofficeResources.getStatus($scope.model.importStatus).then(function (res) {
                    $scope.model.importStatus = res.data;
                    if (!$scope.model.importStatus.finished) {
                        $scope.timer = $timeout($scope.getStatus, 200);
                    } else {
                        $scope.model.submit($scope.model.importStatus.result);
                    }
                });
            };

            $scope.CancelTimer = function () {
                $timeout.cancel($scope.timer);
            };

            $scope.start();
        });



