import tape from 'tape-cup';
import Plugin, {
  createRPCReducer,
  mock,
  withRPCRedux,
  withRPCReactor,
} from '../index';

tape('interface', t => {
  t.equal(typeof Plugin.provides, 'function', 'default export function');
  t.equal(
    typeof createRPCReducer,
    'function',
    'createRPCReducer function export'
  );
  t.equal(typeof mock.provides, 'function', 'mock function export');
  t.equal(typeof withRPCRedux, 'function', 'withRPCRedux function export');
  t.equal(typeof withRPCReactor, 'function', 'withRPCReactor function export');
  t.end();
});
