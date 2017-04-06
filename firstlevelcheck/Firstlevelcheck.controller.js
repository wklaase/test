function FirstlevelcheckController($scope, $state, $pathBuilder, $http, $ionicHistory, $ionicPopover, $sort, $sort2, $serviceOutput, $timeout, $ionicNavBarDelegate, $rootScope) {
    FirstlevelcheckController.$inject = ['$scope', '$state', '$pathBuilder', '$http', '$ionicHistory', '$ionicPopover', '$sort', '$sort2', '$serviceOutput', '$timeout', '$ionicNavBarDelegate', '$rootScope'];

    /**
     * @param $state.params.parent: the parent of the childs that need to be fetched.
     * This parameter is passed on as a state parameter from the previous state.
     */

    $scope.level = $state.params.parent;

    $scope.$on('$ionicView.enter', function () {
        $timeout(function () {
            $ionicNavBarDelegate.align('center');
        });
    });

    $scope.$on('$ionicView.beforeEnter', function (viewData, state) {
        $scope.sortedMode = $state.params.sorted;
        viewData.enableBack = true;

        if ($state.params.type === "MAP") {

            if ($state.params.sorted === true) {
                getFirstLevelChecks(function (firstlevelchecks) {
                    $scope.items = $sort.onStatus(firstlevelchecks);
                });
            }
            else if ($state.params.sorted === false) {
                getFirstLevelChecks(function (firstlevelchecks) {
                    $scope.items = firstlevelchecks;
                });
            }

        }

        else if ($state.params.type === "SERVICE") {

            getService(function (details) {

                $scope.items = $serviceOutput.onStatus(details);

                $scope.hidetype = true;
                $scope.showvalues = true;
                $scope.hideToggle = true;
                $scope.showservicestatus = true;
               
                if (details.status === "OK" && details.indowntime === false) {
                    console.warn("test");
                    $scope.servicestatus = "assets/image/std_medium_ok.png";
                }
                else if (details.status === "OK" && details.indowntime === true) {
                    $scope.servicestatus = "assets/image/std_medium_ok_dt.png";
                }
                else if (details.status === "WARNING" && details.acknowledge === false && details.indowntime === false) {
                    $scope.servicestatus = "assets/image/std_medium_warning.png";
                }
                else if (details.status === "WARNING" && details.acknowledge === true && details.indowntime === false) {
                    $scope.servicestatus = "assets/image/std_medium_warning_ack.png";
                }
                else if (details.status === "WARNING" && details.acknowledge === false && details.indowntime === true) {
                    $scope.servicestatus = "assets/image/std_medium_warning_dt.png";
                }
                else if (details.status === "CRITICAL" && details.acknowledge === false && details.indowntime === false) {
                    $scope.servicestatus = "assets/image/std_medium_critical.png";
                }
                else if (details.status === "CRITICAL" && details.acknowledge === true && details.indowntime === false) {
                    $scope.servicestatus = "assets/image/std_medium_critical_ack.png";
                }
                else if (details.status === "CRITICAL" && details.acknowledge === false && details.indowntime === true) {
                    $scope.servicestatus = "assets/image/std_medium_critical_dt.png";
                }
                else if (details.status === "UNKNOWN" && details.acknowledge === false && details.indowntime === false) {
                    $scope.servicestatus = "assets/image/std_medium_unknown.png";
                }
                else if (details.status === "UNKNOWN" && details.acknowledge === true && details.indowntime === false) {
                    $scope.servicestatus = "assets/image/std_medium_unknown_ack.png";
                }
                else if (details.status === "UNKNOWN" && details.acknowledge === false && details.indowntime === true) {
                    $scope.servicestatus = "assets/image/std_medium_unknown_dt.png";
                }
                else if (details.status === "ERROR") {
                    $scope.servicestatus = "assets/image/std_medium_error.png";
                }
                else if (details.status === "PENDING") {
                    $scope.servicestatus = "assets/image/std_medium_pending.png";
                }

            })
        }

        else if ($state.params.type === "SERVICEGROUP") {

            getServiceGroup(function (services) {
                $scope.items = services;
                $scope.undefinedtype = "Service";
                $scope.showvalues = false;
            })

        }

    });

    $scope.toggleChange = function () {

        if ($scope.sortedMode === false) {

            getFirstLevelChecks(function (firstlevelchecks) {
                $scope.items = $sort.onStatus(firstlevelchecks);
                $scope.sortedMode = true;
                console.warn($scope.sortedMode);

            });

        } else {
            getFirstLevelChecks(function (firstlevelchecks) {
                $scope.items = firstlevelchecks;
                $scope.sortedMode = false;
                console.warn($scope.sortedMode);
            });

        };

    };

    function getFirstLevelChecks(callback, errCallback) {
        $pathBuilder.createPath(['BASE', 'GETMAP'], [$state.params.breadcrumb, $state.params.parent, 'b8dc75e2ec2b3b994eef495fff67d4f07141f86e5f2426f644a1086f819ac64c'],  // deze haal je uit de  application controller.
            function success(path) {
                $http({
                    method: 'GET',
                    url: path
                }).then(function (response) {
                    callback(response.data.objmap);

                });
            },
            function error(error) {
                console.error(error);
                errCallback(null);
            });
    }

    function getServiceGroup(callback, errCallback) {
        $pathBuilder.createPath(['BASE', 'GETSERVICEGROUP'], [$state.params.breadcrumb, $state.params.parent, 'b8dc75e2ec2b3b994eef495fff67d4f07141f86e5f2426f644a1086f819ac64c'],  // deze haal je uit de  application controller.
            function success(path) {
                $http({
                    method: 'GET',
                    url: path
                }).then(function (response) {
                    console.warn(response.data);
                    var values = Object.values(response.data.objservice);
                    var services = values[0];
                    callback(services);

                });
            },
            function error(error) {
                console.error(error);
                errCallback(null);
            });
    }

    function getService(callback, errCallback) {

        $pathBuilder.createPath(['BASE', 'GETSERVICE'], [$state.params.breadcrumb, $state.params.hostname, $state.params.parent, 'b8dc75e2ec2b3b994eef495fff67d4f07141f86e5f2426f644a1086f819ac64c'], // $sate.params.parent haal je uit de home controller!
            function success(path) {
                $http({
                    method: 'GET',
                    url: path
                }).then(function (response) {
                    callback(response.data.objservice);
                    console.log(response.data.objservice);
                });
            },
            function error(error) {
                console.error(error);
                errCallback(null);
            });
    }

    /**
    * @param secondLevelCheck: The item of which the childs need to be fetched
    */

    $scope.goDetail = function (secondLevelCheck, type, hostname) {
        var breadcrumb = $state.params.breadcrumb + '-' + $state.params.parent;

        $state.go('secondlevelcheck', {
            breadcrumb: breadcrumb,
            parent: secondLevelCheck,
            type: type,
            sorted: $scope.sortedMode,
            hostname: hostname
        });
    };


    /**
     * Logout the user and redirect to the login page
     */

    $scope.logout = function () {
        $state.go('login');
        console.warn("Need to logout the user...");
    };
};

angular.module('firstlevelcheck', ['secondlevelcheck'])
    .controller('FirstlevelcheckController', FirstlevelcheckController);