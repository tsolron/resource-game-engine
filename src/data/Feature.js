export default class Feature {
  constructor(n, u) {
    this.name = n;
    this.isUnlocked = u;
    this.list = [];
    this.multiplier = null; // Fn
  }

  unlock() {
    this.isUnlocked = true;
  }

  addResource(n) {
    if (this.list.includes(n)) {
      // Cannot add, already in list
      return false;
    } else {
      this.list.push(n);
    }
  }
}

export function FeatureFactory(n, u, l)
{
  let feature = new Feature(n, u);
  feature.list = l;
  return feature;
};
