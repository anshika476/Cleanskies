/// <reference types="vite/client" />

// This declaration tells TypeScript how to handle image imports.
declare module '*.png' {
  const value: any;
  export default value;
}
