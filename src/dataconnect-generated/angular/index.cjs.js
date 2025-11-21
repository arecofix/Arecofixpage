const { addNewItemRef, getItemsByCategoryRef, updateRepairStatusRef, getRepairsByItemRef } = require('../');
const { DataConnect, CallerSdkTypeEnum } = require('@angular/fire/data-connect');
const { injectDataConnectQuery, injectDataConnectMutation } = require('@tanstack-query-firebase/angular/data-connect');
const { inject, EnvironmentInjector } = require('@angular/core');

exports.injectAddNewItem = function injectAddNewItem(args, injector) {
  return injectDataConnectMutation(addNewItemRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectGetItemsByCategory = function injectGetItemsByCategory(args, options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  getItemsByCategoryRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectUpdateRepairStatus = function injectUpdateRepairStatus(args, injector) {
  return injectDataConnectMutation(updateRepairStatusRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectGetRepairsByItem = function injectGetRepairsByItem(args, options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  const varsFactoryFn = (typeof args === 'function') ? args : () => args;
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  getRepairsByItemRef(dc, varsFactoryFn()),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

