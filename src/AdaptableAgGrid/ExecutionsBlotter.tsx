/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { Root } from 'react-dom/client';
import { GridOptions } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import AdaptableReact, {
  AdaptableApi,
  AdaptableOptions,
  ColumnFilter,
  RowHighlightInfo,
} from '@adaptabletools/adaptable-react-aggrid';
import { columnDefs, defaultColDef } from './columnDefs';
import { rowData, ExecutionData } from './rowData';
import { agGridModules } from './agGridModules';
import { renderReactRoot } from '../react-18-utils';
import '@interopio/theme-demo-apps/dist/io.applications.css';
import { Context, Trade } from '@finos/fdc3';
import ExcelButton from './ExcelButton';
import { useIOConnect } from '@interopio/react-hooks';

interface TradeExtended extends Trade {
  details: {
    tradeId: string;
    executedPrice: string;
    executingVenue: string;
    executedAmount: number;
    executedBroker: string;
    account: string;
    manager: string;
    trader: string;
    tradeDateTime: string;
    settlementDate: string;
    industry: string;
  };
}

const renderWeakMap: WeakMap<HTMLElement, Root> = new WeakMap();

const Revision = 2;

export const ExecutionsBlotter = () => {
  const gridOptions = useMemo<GridOptions<ExecutionData>>(
    () => ({
      defaultColDef,
      columnDefs,
      rowData,
      sideBar: true,
      suppressMenuHide: true,
      enableRangeSelection: true,
      enableCharts: true,
    }),
    [],
  );
  const adaptableOptions = useMemo<AdaptableOptions<ExecutionData>>(
    () => ({
      // licenseKey: import.meta.env.VITE_ADAPTABLE_LICENSE_KEY,
      licenseKey:
        'AppName=interop-Trial|Owner=interop|StartDate=2023-11-23|EndDate=2024-01-23|Ref=AdaptableLicense|Trial=true|TS=1700741032831|C=2692006938,2271485454,4261170317,1260976079,180944542,4061129120,1409499958,3452034758',
      primaryKey: 'TradeID',
      userName: 'Test User',
      adaptableId: 'AdaptableAxesBlotter',
      filterOptions: {
        clearFiltersOnStartUp: true,
      },
      fdc3Options: {
        enableLogging: true,
        intents: {
          listensFor: ['CreateTrade'],
          handleIntent: async ({
            adaptableApi,
            context,
            intent,
          }: {
            adaptableApi: AdaptableApi;
            context: Context;
            intent: string;
          }) => {
            if (intent === 'CreateTrade') {
              const trade = context as TradeExtended;
              const { details } = trade;
              const newRowData = {
                TradeID: details.tradeId,
                OrderID: trade.product.id.productId,
                ExecutedPrice: details.executedPrice,
                ExecutingVenue: details.executingVenue,
                ExecutedAmount: details.executedAmount,
                ExecutedBroker: details.executedBroker,
                Account: details.account,
                Manager: details.manager,
                Trader: details.trader,
                TradeDateTime: details.tradeDateTime,
                SettlementDate: details.settlementDate,
                Industry: details.industry,
              };

              await adaptableApi.gridApi.addGridData([newRowData]);
              const rowHighlightInfo: RowHighlightInfo = {
                primaryKeyValue: details.tradeId,
                timeout: 5000,
                highlightStyle: { BackColor: 'Yellow', ForeColor: 'Black' },
              };

              adaptableApi.gridApi.highlightRow(rowHighlightInfo);

              // TODO: update order blotter status
            }
          },
        },
      },
      predefinedConfig: {
        Dashboard: {
          Revision,
          DashboardTitle: 'Executions',
        },
        Theme: {
          Revision,
          CurrentTheme: 'dark',
        },
        FormatColumn: {
          Revision,
          FormatColumns: [
            {
              Scope: {
                ColumnIds: ['Quantity'],
              },
              DisplayFormat: {
                Formatter: 'NumberFormatter',
                Options: {
                  Suffix: 'M',
                  Multiplier: 0.000001,
                },
              },
            },
            {
              Scope: {
                DataTypes: ['Number'],
              },
              CellAlignment: 'Right',
            },
          ],
        },
      },
    }),
    [],
  );

  const adaptableApiRef = React.useRef<AdaptableApi>();

  const ORDERID_CONTEXT = 'ORDERID_CONTEXT';

  useEffect(() => {
    async function setMyWorkspaceId() {
      const inWsp = await (window as any).io.workspaces?.inWorkspace();
      if (!inWsp) {
        return;
      }

      const myWorkspace = await (window as any).io.workspaces?.getMyWorkspace();
      await (window as any).io.windows.my().updateContext({
        workspaceId: myWorkspace?.id,
      });
    }

    setMyWorkspaceId();
  }, []);

  useIOConnect(async (io) => {
    const workspaceId = (await io.windows.my().getContext()).workspaceId;

    const workspace =
      (await io.workspaces?.getAllWorkspaces())?.find(
        ({ id }) => id === workspaceId,
      ) || (await io.workspaces?.getMyWorkspace());
    if (!workspace) return;

    return workspace.onContextUpdated((context: any) => {
      const adaptableApi = adaptableApiRef.current;

      if (ORDERID_CONTEXT in context && adaptableApi) {
        const orderValue = context[ORDERID_CONTEXT].id?.OrderID;
        const orderIdFilter: ColumnFilter = {
          ColumnId: 'OrderID',
          Predicate: {
            PredicateId: 'Is',
            Inputs: [orderValue],
          },
        };
        adaptableApi.filterApi.setColumnFilters([orderIdFilter]);
      }
    });
  });

  const exportToExcel = () => {
    const cols = adaptableApiRef.current?.columnApi.getColumns();
    const rows = adaptableApiRef.current?.gridApi
      .getAllRowNodes()
      .map((row) => row.data);

    if (!rows || !cols) {
      return;
    }

    adaptableApiRef.current?.exportApi.exportDataToExcel(
      { columns: cols, rows },
      'Executions data',
    );
  };

  return (
    <div
      className={'flex h-screen flex-col'}
      style={
        {
          '--ab-dashboard-header__background': 'hsl(354.98deg 50% 30%)',
        } as React.CSSProperties
      }
    >
      <button
        id="excel-export-button"
        title="Export to Excel"
        type="button"
        onClick={exportToExcel}
      >
        <ExcelButton />
      </button>
      <AdaptableReact
        className={'flex-none'}
        gridOptions={gridOptions}
        adaptableOptions={adaptableOptions}
        renderReactRoot={(node, container) =>
          renderReactRoot(node, container, renderWeakMap)
        }
        onAdaptableReady={({ adaptableApi }) => {
          adaptableApiRef.current = adaptableApi;
        }}
      />
      <div className="ag-tick42 flex-1">
        <AgGridReact gridOptions={gridOptions} modules={agGridModules} />
      </div>
    </div>
  );
};
