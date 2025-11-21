import { AddNewItemData, AddNewItemVariables, GetItemsByCategoryData, GetItemsByCategoryVariables, UpdateRepairStatusData, UpdateRepairStatusVariables, GetRepairsByItemData, GetRepairsByItemVariables } from '../';
import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise} from '@angular/fire/data-connect';
import { CreateQueryResult, CreateMutationResult} from '@tanstack/angular-query-experimental';
import { CreateDataConnectQueryResult, CreateDataConnectQueryOptions, CreateDataConnectMutationResult, DataConnectMutationOptionsUndefinedMutationFn } from '@tanstack-query-firebase/angular/data-connect';
import { FirebaseError } from 'firebase/app';
import { Injector } from '@angular/core';

type AddNewItemOptions = DataConnectMutationOptionsUndefinedMutationFn<AddNewItemData, FirebaseError, AddNewItemVariables>;
export function injectAddNewItem(options?: AddNewItemOptions, injector?: Injector): CreateDataConnectMutationResult<AddNewItemData, AddNewItemVariables, AddNewItemVariables>;

type GetItemsByCategoryArgs = GetItemsByCategoryVariables | (() => GetItemsByCategoryVariables);
export type GetItemsByCategoryOptions = () => Omit<CreateDataConnectQueryOptions<GetItemsByCategoryData, GetItemsByCategoryVariables>, 'queryFn'>;
export function injectGetItemsByCategory(args: GetItemsByCategoryArgs, options?: GetItemsByCategoryOptions, injector?: Injector): CreateDataConnectQueryResult<GetItemsByCategoryData, GetItemsByCategoryVariables>;

type UpdateRepairStatusOptions = DataConnectMutationOptionsUndefinedMutationFn<UpdateRepairStatusData, FirebaseError, UpdateRepairStatusVariables>;
export function injectUpdateRepairStatus(options?: UpdateRepairStatusOptions, injector?: Injector): CreateDataConnectMutationResult<UpdateRepairStatusData, UpdateRepairStatusVariables, UpdateRepairStatusVariables>;

type GetRepairsByItemArgs = GetRepairsByItemVariables | (() => GetRepairsByItemVariables);
export type GetRepairsByItemOptions = () => Omit<CreateDataConnectQueryOptions<GetRepairsByItemData, GetRepairsByItemVariables>, 'queryFn'>;
export function injectGetRepairsByItem(args: GetRepairsByItemArgs, options?: GetRepairsByItemOptions, injector?: Injector): CreateDataConnectQueryResult<GetRepairsByItemData, GetRepairsByItemVariables>;
