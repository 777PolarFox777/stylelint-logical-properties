const dirSelectorRegExp = /:dir\(ltr|rtl\)/i;
const isDirRule = (node) => node.type === 'rule' && dirSelectorRegExp.test(node.selector);

// walk all container nodes
export const walk = (node, fn) => {
  if (node.nodes && node.nodes.length) {
    const nodes = node.nodes.slice();
    const { length } = nodes;
    let index = -1;

    // eslint-disable-next-line no-plusplus
    while (++index < length) {
      const child = nodes[index];

      if (!isDirRule(child)) {
        fn(child);

        walk(child, fn);
      }
    }
  }
};
