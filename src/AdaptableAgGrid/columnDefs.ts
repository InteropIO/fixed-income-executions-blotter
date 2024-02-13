import { ColDef } from '@ag-grid-community/core';
import { ExecutionData } from './rowData';

export const defaultColDef: ColDef = {
  filter: true,
  floatingFilter: true,
  sortable: true,
  resizable: true,
  editable: true,
  enableRowGroup: true,
};

export const columnDefs: ColDef<ExecutionData>[] = [
  {
    field: 'TradeID',
    headerName: 'Trade ID',
    type: 'abColDefNumber',
  },

  {
    field: 'OrderID',
    headerName: 'Order ID',
    type: 'abColDefNumber',
  },
  {
    field: 'ISIN',
    headerName: 'ISIN',
    type: 'abColDefNumber',
  },
  {
    field: 'Description',
    headerName: 'Description',
    type: 'abColDefNumber',
  },

  {
    field: 'ExecutedPrice',
    headerName: 'Executed Price',
    type: 'abColDefNumber',
  },

  {
    field: 'ExecutingVenue',
    headerName: 'Executing Venue',
    type: 'abColDefNumber',
  },

  {
    field: 'ExecutedAmount',
    headerName: 'Executed Amount',
    type: 'abColDefNumber',
  },

  {
    field: 'ExecutedBroker',
    headerName: 'Executed Broker',
    type: 'abColDefNumber',
  },

  {
    field: 'Account',
    headerName: 'Account',
    type: 'abColDefNumber',
  },

  {
    field: 'Manager',
    headerName: 'Manager',
    type: 'abColDefNumber',
  },

  {
    field: 'Trader',
    headerName: 'Trader',
    type: 'abColDefNumber',
  },

  {
    field: 'TradeDateTime',
    headerName: 'TradeDate Time',
    type: 'abColDefNumber',
  },

  {
    field: 'SettlementDate',
    headerName: 'Settlement Date',
    type: 'abColDefNumber',
  },

  {
    field: 'Industry',
    headerName: 'Industry',
    type: 'abColDefNumber',
  },
];
