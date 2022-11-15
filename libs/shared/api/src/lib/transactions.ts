import {
  RPCRequest,
  RPCRequestMethod,
  Transaction,
  PublicRPCRequestMethod,
  APIEvents,
  GetTransactionRequest,
  SignAndSubmitTransactionRequest,
  CancelTransactionRequest,
} from '@multiverse-wallet/multiverse';
import { API, EXTENSION_ORIGIN } from './api';
import { State } from './resource';
import { v4 as uuid } from 'uuid';
import * as xrpl from 'xrpl';
import { TxRequest } from 'xrpl';
import { PublicMethod } from './decorators';

const PENDING_TRANSACTION_TIMEOUT_MS = 60_000;

export interface TransactionsState {
  transactions: Transaction[];
}

export class TransactionsResource {
  public state = new State<TransactionsState>(TransactionsResource.name, {
    transactions: [],
  });
  public xrpl: xrpl.Client | undefined;
  constructor(private api: API) {
    api.rpcMethodRegistry.set(PublicRPCRequestMethod.requestTransaction, (r) =>
      this.requestTransaction(r)
    );
    api.rpcMethodRegistry.set(PublicRPCRequestMethod.getTransaction, (r) =>
      this.getTransaction(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.listTransactions, () =>
      this.listTransactions()
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.signAndSubmitTransaction, (r) =>
      this.signAndSubmitTransaction(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.cancelTransaction, (r) =>
      this.cancelTransaction(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.clearTransactionHistory, (r) =>
      this.clearTransactionHistory()
    );
    setInterval(() => this.pollTransactions(), 1000);
    setInterval(() => this.expirePendingTransactions(), 1000);
  }
  @PublicMethod()
  async requestTransaction(req: RPCRequest<any>) {
    const id = uuid();
    const client = await this.getXRPLClient();
    const filledTxJson = await client.autofill(req.data);
    await this.state.fetchAndUpdate(async (state) => {
      const ts = Date.now();
      state.transactions.unshift({
        id,
        txJson: filledTxJson,
        origin: req.origin,
        status: 'pending',
        lastUpdate: ts,
        createdAt: ts,
      });
      return state;
    });
    if (req.origin !== EXTENSION_ORIGIN) {
      await this.api.extension.openPopup({
        id: req.id,
        origin: req.origin,
        method: RPCRequestMethod.openPopup,
        data: { path: `/popup/transaction/${id}` },
      });
    }
    return { result: id };
  }
  @PublicMethod()
  async getTransaction(req: RPCRequest<GetTransactionRequest>) {
    const { transactions } = await this.state.fetch();
    const transaction = transactions.find(
      (transaction) => transaction.id === req.data.id
    );
    if (!transaction) {
      return { error: `no transaction found with id: ${req.data.id}` };
    }
    if (req.origin !== EXTENSION_ORIGIN && transaction.origin !== req.origin) {
      return {
        error: `origin not authorised to get transaction with id: ${req.data.id}`,
      };
    }
    return { result: transaction };
  }
  async signAndSubmitTransaction(
    req: RPCRequest<SignAndSubmitTransactionRequest>
  ) {
    const { transactions } = await this.state.fetch();
    const wallet = await this.api.accounts.getCurrentWallet();
    const transaction = transactions.find((t) => t.id === req.data.id);
    if (!transaction) {
      return { error: `no transaction found with id: ${req.data.id}` };
    }
    if (transaction.status !== 'pending') {
      return { error: 'transaction no longer pending' };
    }
    try {
      // Fetch the current client.
      const client = await this.getXRPLClient();
      // Auto-fill the transaction fields.
      const { tx_blob, hash } = wallet.sign(transaction.txJson);
      // Set the tx hash
      transaction.txHash = hash;
      // Submit to the xrpl
      const submitTxRes = await client.submit(tx_blob);
      // Update the stored transaction.
      this.state.fetchAndUpdate(async (state) => {
        state.transactions = state.transactions.map((t) => {
          if (t.id === transaction.id) {
            transaction.status = 'submitted';
            transaction.lastUpdate = Date.now();
            this.api.emit(APIEvents.transactionStatusChanged, transaction, [
              transaction.origin,
            ]);
            this.api.emit(APIEvents.update);
            return transaction;
          }
          return t;
        });
        return state;
      });
      return { result: hash };
    } catch (e: any) {
      // Update the stored transaction.
      this.state.fetchAndUpdate(async (state) => {
        state.transactions = state.transactions.map((t) => {
          if (t.id === transaction.id) {
            transaction.status = 'failed';
            transaction.errorMessage = e.message;
            transaction.lastUpdate = Date.now();
            return transaction;
          }
          this.api.emit(APIEvents.transactionStatusChanged, t, [t.origin]);
          this.api.emit(APIEvents.update);
          return t;
        });
        return state;
      });
      return { error: e.message };
    }
  }
  async cancelTransaction(req: RPCRequest<CancelTransactionRequest>) {
    const { transactions } = await this.state.fetchAndUpdate(async (state) => {
      return {
        ...state,
        transactions: state.transactions.map((tx) => {
          if (tx.id === req.data.id && tx.status === 'pending') {
            tx.status = 'cancelled';
            this.api.emit(APIEvents.transactionStatusChanged, tx, [tx.origin]);
            this.api.emit(APIEvents.update);
          }
          return tx;
        }),
      };
    });
    return { result: transactions.find((tx) => tx.id === req.data.id) };
  }
  async expirePendingTransactions() {
    await this.state.fetchAndUpdate(async (state) => {
      return {
        ...state,
        transactions: state.transactions.map((tx) => {
          const expirePendingBefore =
            Date.now() - PENDING_TRANSACTION_TIMEOUT_MS;
          if (tx.status === 'pending' && tx.createdAt < expirePendingBefore) {
            tx.status = 'cancelled';
            tx.errorMessage = 'cancelled due to timeout';
            this.api.emit(APIEvents.transactionStatusChanged, tx, [tx.origin]);
            this.api.emit(APIEvents.update);
          }
          return tx;
        }),
      };
    });
  }
  async pollTransactions() {
    const client = await this.getXRPLClient();
    const { transactions } = await this.state.fetch();
    const submittedTransactions = transactions.filter(
      (tx) => tx.status === 'submitted'
    );
    for (const submittedTx of submittedTransactions) {
      let txRes: any;
      let txError: any;
      try {
        txRes = await client.request({
          command: 'tx',
          transaction: submittedTx.txHash!,
        } as TxRequest);
      } catch (e: any) {
        txError = e;
      }
      await this.state.fetchAndUpdate(async (state) => {
        return {
          ...state,
          transactions: state.transactions.map((tx) => {
            if (tx.txHash !== submittedTx.txHash) {
              return tx;
            }
            let hasUpdated = false;
            if (txError) {
              tx.status = 'failed';
              tx.rawTxResponse = txError;
              hasUpdated = true;
              tx.lastUpdate = Date.now();
              tx.errorMessage = txError.message;
            }
            if (tx.txHash === txRes?.result?.hash) {
              tx.txJson = txRes?.result;
              tx.rawTxResponse = txRes;
              if (txRes?.result?.validated) {
                tx.status = 'validated';
                hasUpdated = true;
                tx.lastUpdate = Date.now();
              }
              if (txRes?.status === 'error') {
                tx.status = 'failed';
                hasUpdated = true;
                tx.lastUpdate = Date.now();
              }
            }
            if (hasUpdated) {
              // If the transaction status has been updated then
              // emit a transactionStatusChanged event.
              this.api.emit(APIEvents.transactionStatusChanged, tx, [
                tx.origin,
              ]);
              this.api.emit(APIEvents.update);
            }
            return tx;
          }),
        };
      });
    }
  }
  async getXRPLClient(): Promise<xrpl.Client> {
    const { selectedNetwork } = await this.api.networks.state.fetch();
    if (!this.xrpl) {
      this.xrpl = new xrpl.Client(selectedNetwork.server);
      await this.xrpl.connect().catch((e) => {
        console.error(e);
      });
      return this.xrpl;
    }
    if (this.xrpl.connection.getUrl() !== selectedNetwork.server) {
      await this.xrpl.disconnect();
      this.xrpl = new xrpl.Client(selectedNetwork.server);
      await this.xrpl.connect();
      return this.xrpl;
    }
    if (!this.xrpl.isConnected()) {
      await this.xrpl.connect().catch((e) => {
        console.error(e);
      });
    }
    return this.xrpl;
  }
  async listTransactions() {
    const { transactions } = await this.state.fetch();
    return { result: transactions };
  }
  async clearTransactionHistory() {
    await this.state.fetchAndUpdate(async (state) => {
      return {
        ...state,
        transactions: state.transactions.filter((tx) => {
          return tx.status === 'pending' || tx.status === 'submitted';
        }),
      };
    });
    this.api.emit(APIEvents.update);
    return { result: true };
  }
}
