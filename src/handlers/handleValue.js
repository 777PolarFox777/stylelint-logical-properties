import { physicalValue } from '../maps';
import { isDeclAnException, isNodeMatchingDecl } from '../helpers';

export const handleValue = ({
  node, isAutofix, reportedDecls, propExceptions, reportUnexpectedValue, dir,
}) => physicalValue(dir).forEach(([regexp, props]) => {
  if (isNodeMatchingDecl(node, regexp) && !isDeclAnException(node, propExceptions)) {
    const valueKey = node.value.toLowerCase();

    if (valueKey in props) {
      const value = props[valueKey];

      if (isAutofix) {
        // eslint-disable-next-line no-param-reassign
        node.value = value;
      } else {
        reportUnexpectedValue(node, value);

        reportedDecls.set(node);
      }
    }
  }
});
