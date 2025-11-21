const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'arecofixpage',
  location: 'southamerica-west1'
};
exports.connectorConfig = connectorConfig;

const addNewItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewItem', inputVars);
}
addNewItemRef.operationName = 'AddNewItem';
exports.addNewItemRef = addNewItemRef;

exports.addNewItem = function addNewItem(dcOrVars, vars) {
  return executeMutation(addNewItemRef(dcOrVars, vars));
};

const getItemsByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetItemsByCategory', inputVars);
}
getItemsByCategoryRef.operationName = 'GetItemsByCategory';
exports.getItemsByCategoryRef = getItemsByCategoryRef;

exports.getItemsByCategory = function getItemsByCategory(dcOrVars, vars) {
  return executeQuery(getItemsByCategoryRef(dcOrVars, vars));
};

const updateRepairStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateRepairStatus', inputVars);
}
updateRepairStatusRef.operationName = 'UpdateRepairStatus';
exports.updateRepairStatusRef = updateRepairStatusRef;

exports.updateRepairStatus = function updateRepairStatus(dcOrVars, vars) {
  return executeMutation(updateRepairStatusRef(dcOrVars, vars));
};

const getRepairsByItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRepairsByItem', inputVars);
}
getRepairsByItemRef.operationName = 'GetRepairsByItem';
exports.getRepairsByItemRef = getRepairsByItemRef;

exports.getRepairsByItem = function getRepairsByItem(dcOrVars, vars) {
  return executeQuery(getRepairsByItemRef(dcOrVars, vars));
};
