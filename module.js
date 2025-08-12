var app = angular.module("app", []);

app.controller("homeController", function($scope, $window, $timeout) {
  var vm = this;
  $scope.vm = vm; // expose as vm in template
  vm.tab = 1;

  // persist last tab while browsing within the session (nice UX)
  vm.setTab = function(n) {
    vm.tab = n;
    try { sessionStorage.setItem('sv_active_tab', String(n)); } catch(e) {}
  };

  // restore if available
  $timeout(function(){
    try {
      var saved = parseInt(sessionStorage.getItem('sv_active_tab'), 10);
      if (!isNaN(saved)) vm.tab = saved;
      $scope.$applyAsync();
    } catch(e) {}
  }, 0);

  // smooth scroll to About section when it becomes active
  $scope.$watch(function(){ return vm.tab; }, function(nv){
    if (nv === 2) {
      $timeout(function(){
        var el = document.getElementById('secBookmark');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      $window.scrollTo(0,0);
    }
  });
});
