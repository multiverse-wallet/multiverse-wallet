import { EXTENSION_ORIGIN, RPCRequest } from "@multiverse-wallet/multiverse";
import "reflect-metadata";

export function OriginWhitelist(...origins: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (req: RPCRequest<any>) {
      console.log("middleware", req);
      if (!origins.includes(req.origin)) {
        return Promise.resolve({ error: "permission denied due to origin" });
      }
      return originalMethod.apply(this, [req]);
    };
    return descriptor;
  };
}

export function ExtensionOriginOnly() {
  return OriginWhitelist(EXTENSION_ORIGIN);
}