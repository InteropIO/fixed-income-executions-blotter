import * as React from 'react';
import { ExecutionsBlotter } from './AdaptableAgGrid';
import { IOConnectContext } from '@interopio/react-hooks';

function App() {
  const io = React.useContext(IOConnectContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).io = io;

  return (
    <div className="selection:bg-green-900">
      <ExecutionsBlotter></ExecutionsBlotter>
    </div>
  );
}

export default App;
