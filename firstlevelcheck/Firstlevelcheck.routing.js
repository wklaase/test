function FirstlevelcheckRouting($stateProvider) {
    FirstlevelcheckRouting.$inject = ['$stateProvider'];

    $stateProvider.state('firstlevelcheck', {
        url: '/firstlevelcheck',
        templateUrl: 'app/shared/listtemplate.html',
        controller: 'FirstlevelcheckController',
        params: {
            breadcrumb: null,
            parent: null,
            type: null,
            sorted: null,
            hostname: null
        }
    });
}

angular.module('firstlevelcheck')
    .config(FirstlevelcheckRouting)