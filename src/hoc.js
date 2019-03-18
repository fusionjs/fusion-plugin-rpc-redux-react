/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import PropTypes from 'prop-types';
import * as React from 'react';
import type {Reducer} from 'redux';
import {createRPCHandler, createRPCReactors} from 'fusion-rpc-redux';

type RPCReducersType = {
  start?: Reducer<*, *>,
  success?: Reducer<*, *>,
  failure?: Reducer<*, *>,
};
export function withRPCReactor<Props: {}>(
  rpcId: string,
  reducers: RPCReducersType,
  {
    propName,
    transformParams,
    mapStateToParams,
  }: {
    propName?: string,
    transformParams?: (params: any) => any,
    mapStateToParams?: (state: any, args?: any, ownProps: Props) => any,
  } = {}
) {
  return withRPCRedux(rpcId, {
    actions: createRPCReactors(rpcId, reducers),
    propName,
    rpcId,
    transformParams,
    mapStateToParams,
  });
}

export function withRPCRedux<Props: {}>(
  rpcId: string,
  {
    propName = rpcId,
    actions,
    transformParams,
    mapStateToParams,
  }: {
    propName?: string,
    actions?: any,
    transformParams?: (params: any) => any,
    mapStateToParams?: (state: any, args?: any, ownProps: Props) => any,
  } = {}
): (React.ComponentType<*>) => React.ComponentType<*> {
  return (Component: React.ComponentType<Props>) => {
    class withRPCRedux extends React.Component<Props, *> {
      render() {
        const {rpc, store} = this.context;
        if (mapStateToParams) {
          const mapState = mapStateToParams;
          mapStateToParams = (state, args) => mapState(state, args, this.props);
        }
        const handler = createRPCHandler({
          rpcId,
          rpc,
          store,
          actions,
          mapStateToParams,
          transformParams,
        });
        const props = {
          ...this.props,
          [propName]: handler,
        };
        return React.createElement(Component, props);
      }
    }
    const displayName = Component.displayName || Component.name || 'Anonymous';
    withRPCRedux.displayName = 'WithRPCRedux' + '(' + displayName + ')';
    withRPCRedux.contextTypes = {
      rpc: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    };
    return withRPCRedux;
  };
}
