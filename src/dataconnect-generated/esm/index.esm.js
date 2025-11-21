import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'arecofixpage',
  location: 'southamerica-west1'
};

export const addNewItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewItem', inputVars);
}
addNewItemRef.operationName = 'AddNewItem';

export function addNewItem(dcOrVars, vars) {
  return executeMutation(addNewItemRef(dcOrVars, vars));
}

export const getItemsByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetItemsByCategory', inputVars);
}
getItemsByCategoryRef.operationName = 'GetItemsByCategory';

export function getItemsByCategory(dcOrVars, vars) {
  return executeQuery(getItemsByCategoryRef(dcOrVars, vars));
}

export const updateRepairStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateRepairStatus', inputVars);
}
updateRepairStatusRef.operationName = 'UpdateRepairStatus';

export function updateRepairStatus(dcOrVars, vars) {
  return executeMutation(updateRepairStatusRef(dcOrVars, vars));
}

export const getRepairsByItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRepairsByItem', inputVars);
}
getRepairsByItemRef.operationName = 'GetRepairsByItem';

export function getRepairsByItem(dcOrVars, vars) {
  return executeQuery(getRepairsByItemRef(dcOrVars, vars));
}

