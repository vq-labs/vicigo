export default class ScopeService {
  constructor() {}

  public safeApply($scope, fn) {
    var phase = $scope.$root.$$phase;
    if (phase == '$apply' || phase == '$digest') {
      if (fn && typeof fn === 'function') {
        fn();
      }
    } else {
      $scope.$apply(fn);
    }
  }
}
