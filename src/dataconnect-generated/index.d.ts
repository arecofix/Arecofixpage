import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddNewItemData {
  item_insert: Item_Key;
}

export interface AddNewItemVariables {
  userId: UUIDString;
  category: string;
  name: string;
}

export interface GetItemsByCategoryData {
  items: ({
    id: UUIDString;
    name: string;
    category: string;
    createdAt: TimestampString;
  } & Item_Key)[];
}

export interface GetItemsByCategoryVariables {
  category: string;
}

export interface GetRepairsByItemData {
  repairs: ({
    id: UUIDString;
    description: string;
    status: string;
    createdAt: TimestampString;
  } & Repair_Key)[];
}

export interface GetRepairsByItemVariables {
  itemId: UUIDString;
}

export interface Item_Key {
  id: UUIDString;
  __typename?: 'Item_Key';
}

export interface Part_Key {
  id: UUIDString;
  __typename?: 'Part_Key';
}

export interface Repair_Key {
  id: UUIDString;
  __typename?: 'Repair_Key';
}

export interface UpdateRepairStatusData {
  repair_update?: Repair_Key | null;
}

export interface UpdateRepairStatusVariables {
  id: UUIDString;
  status: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface AddNewItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewItemVariables): MutationRef<AddNewItemData, AddNewItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddNewItemVariables): MutationRef<AddNewItemData, AddNewItemVariables>;
  operationName: string;
}
export const addNewItemRef: AddNewItemRef;

export function addNewItem(vars: AddNewItemVariables): MutationPromise<AddNewItemData, AddNewItemVariables>;
export function addNewItem(dc: DataConnect, vars: AddNewItemVariables): MutationPromise<AddNewItemData, AddNewItemVariables>;

interface GetItemsByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetItemsByCategoryVariables): QueryRef<GetItemsByCategoryData, GetItemsByCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetItemsByCategoryVariables): QueryRef<GetItemsByCategoryData, GetItemsByCategoryVariables>;
  operationName: string;
}
export const getItemsByCategoryRef: GetItemsByCategoryRef;

export function getItemsByCategory(vars: GetItemsByCategoryVariables): QueryPromise<GetItemsByCategoryData, GetItemsByCategoryVariables>;
export function getItemsByCategory(dc: DataConnect, vars: GetItemsByCategoryVariables): QueryPromise<GetItemsByCategoryData, GetItemsByCategoryVariables>;

interface UpdateRepairStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRepairStatusVariables): MutationRef<UpdateRepairStatusData, UpdateRepairStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateRepairStatusVariables): MutationRef<UpdateRepairStatusData, UpdateRepairStatusVariables>;
  operationName: string;
}
export const updateRepairStatusRef: UpdateRepairStatusRef;

export function updateRepairStatus(vars: UpdateRepairStatusVariables): MutationPromise<UpdateRepairStatusData, UpdateRepairStatusVariables>;
export function updateRepairStatus(dc: DataConnect, vars: UpdateRepairStatusVariables): MutationPromise<UpdateRepairStatusData, UpdateRepairStatusVariables>;

interface GetRepairsByItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRepairsByItemVariables): QueryRef<GetRepairsByItemData, GetRepairsByItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetRepairsByItemVariables): QueryRef<GetRepairsByItemData, GetRepairsByItemVariables>;
  operationName: string;
}
export const getRepairsByItemRef: GetRepairsByItemRef;

export function getRepairsByItem(vars: GetRepairsByItemVariables): QueryPromise<GetRepairsByItemData, GetRepairsByItemVariables>;
export function getRepairsByItem(dc: DataConnect, vars: GetRepairsByItemVariables): QueryPromise<GetRepairsByItemData, GetRepairsByItemVariables>;

