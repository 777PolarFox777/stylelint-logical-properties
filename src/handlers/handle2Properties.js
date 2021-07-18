import { physical2Prop } from '../maps';
import { validateRuleWithProps, isDeclAnException, isDeclReported } from '../helpers';

export const handle2Properties = ({
  node, isAutofix, reportedDecls, propExceptions, reportUnexpectedProperty,
}) => physical2Prop.forEach(([props, prop]) => {
  validateRuleWithProps(node, props, (startDecl, startIndex, endDecl, endStartIndex) => {
    const firstInlineDecl = startIndex < endStartIndex
      ? startDecl
      : endDecl;

    if (
      !isDeclAnException(startDecl, propExceptions)
      && !isDeclAnException(endDecl, propExceptions)
    ) {
      if (isAutofix) {
        firstInlineDecl.cloneBefore({
          prop,
          value: startDecl.value === endDecl.value
            ? startDecl.value
            : [startDecl.value, endDecl.value].join(' '),
        });

        startDecl.remove();
        endDecl.remove();
      } else if (
        !isDeclReported(startDecl, reportedDecls)
        && !isDeclReported(endDecl, reportedDecls)
      ) {
        reportUnexpectedProperty(firstInlineDecl, prop);

        reportedDecls.set(startDecl);
        reportedDecls.set(endDecl);
      }
    }
  });
});
