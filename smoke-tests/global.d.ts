declare global {
  function subql<T>(query: string): Promise<T>
}

export {}
