let currRequestId = 0

export function incrementAndGet() {
  return ++currRequestId
}

export function isRequestSuperseded(requestId) {
  return requestId < currRequestId
}
