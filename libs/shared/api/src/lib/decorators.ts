import 'reflect-metadata';

const publicMethods: string[] = [];

export function PublicMethod() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    publicMethods.push(propertyKey);
    return descriptor;
  };
}

export function isPublicMethod(method: string): boolean {
  return publicMethods.includes(method);
}

const whitelistedMethods: string[] = [];

export function WhitelistedMethod() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    whitelistedMethods.push(propertyKey);
    return descriptor;
  };
}

export function isWhitelistedMethod(method: string): boolean {
  return whitelistedMethods.includes(method);
}
