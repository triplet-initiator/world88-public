export const setPercentageList = (pt = 0) => {
  let options = [];
  while (pt >= 0) {
    options = [
      ...options,
      {
        label: pt,
        value: pt,
      },
    ];
    pt--;
  }
  return options;
};
