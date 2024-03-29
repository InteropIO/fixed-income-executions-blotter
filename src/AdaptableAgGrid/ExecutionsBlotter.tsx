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
        'AppName=Interop-Universal|Owner=Interop|StartDate=2024-02-19|EndDate=2024-08-19|Ref=AdaptableLicense|TS=1708358445822|C=3338536950,2753137919,1260976079,3157789641,3548769197,2612951722,1814935034',
      primaryKey: 'TradeID',
      userName: 'Test User',
      adaptableId: 'AdaptableAxesBlotter',
      filterOptions: {
        clearFiltersOnStartUp: true,
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

  return (
    <div
      className={'flex h-screen flex-col'}
      style={
        {
          '--ab-dashboard-header__background': 'hsl(354.98deg 50% 30%)',
        } as React.CSSProperties
      }
    >
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
