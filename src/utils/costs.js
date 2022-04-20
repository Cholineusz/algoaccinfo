const COSTS = {
  UINT: 28500,
  BYTE_SLICE: 50000,
  OPT_IN: 100000,
  TRANSACTION_FEE: 1000,

  estimateUintCost: (uIntCount) => {
    return uIntCount * COSTS.UINT;
  },
  estimateByteSliceCost: (byteSliceCount) => {
    return byteSliceCount * COSTS.BYTE_SLICE;
  },
  estimateOptInAppCost: (uIntCount, byteSliceCount) => {
    return (
      COSTS.estimateUintCost(uIntCount) +
      COSTS.estimateByteSliceCost(byteSliceCount) +
      COSTS.OPT_IN
    );
  },
  estimateCreatedAppCost: (extraPages, uIntCount, byteSliceCount) => {
    return (
      COSTS.estimateUintCost(uIntCount) +
      COSTS.estimateByteSliceCost(byteSliceCount) +
      COSTS.OPT_IN * (1 + extraPages)
    );
  },
};
export default COSTS;
