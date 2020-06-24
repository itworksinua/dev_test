declare module "*.png" {
  const value: any;
  export default value;
}

//this is a hack to fix vs code
// https://github.com/Microsoft/TypeScript/issues/30471

declare module "console" {
  export = typeof import(`console`);
}
