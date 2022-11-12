import {
  GetTransactionRequest,
  MockTransport,
  PublicAPI,
  RPCRequest,
} from "@multiverse-wallet/multiverse";
import { render, act } from "@testing-library/react";
import { useConnect, useAccount, useNetwork, useTransaction } from "./hooks";

describe("useConnect", () => {
  let api: PublicAPI;
  let mockTransport: MockTransport;
  beforeEach(() => {
    api = new PublicAPI();
    mockTransport = new MockTransport();
    api.setTransport(mockTransport);
  });
  const TestComponent = () => {
    const { isConnected } = useConnect({ overrideApi: api });
    return <div>{isConnected ? "Connected" : "Not Connected"}</div>;
  };
  it("should render successfully", async () => {
    let baseElement;
    await act(() => {
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toBeTruthy();
  });
  it("should render connected", async () => {
    let baseElement;
    await act(() => {
      mockTransport.mockResolvedValue(true);
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toMatchSnapshot();
  });
  it("should render not connected", async () => {
    let baseElement;
    await act(() => {
      mockTransport.mockResolvedValue(false);
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toMatchSnapshot();
  });
});

describe("useAccount", () => {
  let api: PublicAPI;
  let mockTransport: MockTransport;
  beforeEach(() => {
    api = new PublicAPI();
    mockTransport = new MockTransport();
    api.setTransport(mockTransport);
  });
  const TestComponent = () => {
    const { account, error } = useAccount({ overrideApi: api });
    if (error) {
      return <div>{error?.message}</div>;
    }
    return <div>{account?.name}</div>;
  };
  it("should render successfully", async () => {
    let baseElement;
    await act(() => {
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toBeTruthy();
  });
  it("should render account", async () => {
    let baseElement;
    await act(() => {
      mockTransport.mockResolvedValue({ name: "Test Account" });
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toMatchSnapshot();
  });
  it("should render error", async () => {
    let baseElement;
    await act(() => {
      mockTransport.mockRejectedValue(new Error("an error occurred"));
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toMatchSnapshot();
  });
});

describe("useNetwork", () => {
  let api: PublicAPI;
  let mockTransport: MockTransport;
  beforeEach(() => {
    api = new PublicAPI();
    mockTransport = new MockTransport();
    api.setTransport(mockTransport);
  });
  const TestComponent = () => {
    const { network, error } = useNetwork({ overrideApi: api });
    if (error) {
      return <div>{error?.message}</div>;
    }
    return <div>{network?.name}</div>;
  };
  it("should render successfully", async () => {
    let baseElement;
    await act(() => {
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toBeTruthy();
  });
  it("should render network", async () => {
    let baseElement;
    await act(() => {
      mockTransport.mockResolvedValue({ name: "Test Network" });
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toMatchSnapshot();
  });
  it("should render error", async () => {
    let baseElement;
    await act(() => {
      mockTransport.mockRejectedValue(new Error("an error occurred"));
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toMatchSnapshot();
  });
});

describe("useTransaction", () => {
  let api: PublicAPI;
  let mockTransport: MockTransport;
  beforeEach(() => {
    api = new PublicAPI();
    mockTransport = new MockTransport();
    api.setTransport(mockTransport);
  });
  const transactionId = "test"
  const TestComponent = () => {
    const { transaction, error } = useTransaction({
      transactionId,
      overrideApi: api,
    });
    if (error) {
      return <div>{error?.message}</div>;
    }
    return <div>{transaction?.id}</div>;
  };
  it("should render successfully", async () => {
    let baseElement;
    await act(() => {
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toBeTruthy();
  });
  it("should render transaction", async () => {
    let baseElement;
    await act(() => {
      mockTransport.mockResolvedValue(
        (req: RPCRequest<GetTransactionRequest>) => {
          return {
            [transactionId]: {
              id: transactionId,
            },
          }[req.data.id];
        }
      );
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toMatchSnapshot();
  });
  it("should render error", async () => {
    let baseElement;
    await act(() => {
      mockTransport.mockRejectedValue(new Error("an error occurred"));
      const component = render(<TestComponent />);
      baseElement = component.baseElement;
    });
    expect(baseElement).toMatchSnapshot();
  });
});
