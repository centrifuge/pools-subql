export {}
declare global {
  function getNodeEvmChainId(): Promise<string | undefined>
}
