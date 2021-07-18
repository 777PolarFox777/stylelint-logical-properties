import { physical4Prop } from '../maps';
import { validateRuleWithProps, isDeclAnException, isDeclReported } from '../helpers';

export const handle4Properties = ({
  node, isAutofix, reportedDecls, propExceptions, reportUnexpectedProperty,
}) => physical4Prop.forEach(([props, prop]) => {
  validateRuleWithProps(
    node,
    props,
    (
      blockStartDecl,
      blockStartIndex,
      inlineStartDecl,
      inlineStartIndex,
      blockEndDecl,
      blockEndIndex,
      inlineEndDecl,
    ) => {
      const firstInlineDecl = blockStartDecl;
      if (
        !isDeclAnException(blockStartDecl, propExceptions)
      && !isDeclAnException(inlineStartDecl, propExceptions)
      && !isDeclAnException(blockEndDecl, propExceptions)
      && !isDeclAnException(inlineEndDecl, propExceptions)
      ) {
        if (isAutofix) {
          const values = [
            blockStartDecl.value,
            inlineStartDecl.value,
            blockEndDecl.value,
            inlineEndDecl.value,
          ];

          if (Array.isArray(prop)) {
            const [blockStart, inlineEnd, blockEnd, inlineStart] = values;
            firstInlineDecl.cloneBefore({
              prop: prop[0],
              value: [blockStart, blockEnd].join(' '),
            });
            firstInlineDecl.cloneBefore({
              prop: prop[1],
              value: [inlineStart, inlineEnd].join(' '),
            });
          } else {
            firstInlineDecl.cloneBefore({
              prop,
              value: values.join(' '),
            });
          }

          blockStartDecl.remove();
          inlineStartDecl.remove();
          blockEndDecl.remove();
          inlineEndDecl.remove();
        } else if (
          !isDeclReported(blockStartDecl, reportedDecls)
        && !isDeclReported(inlineStartDecl, reportedDecls)
        && !isDeclReported(blockEndDecl, reportedDecls)
        && !isDeclReported(inlineEndDecl, reportedDecls)
        ) {
          reportUnexpectedProperty(firstInlineDecl, prop);

          reportedDecls.set(blockStartDecl);
          reportedDecls.set(inlineStartDecl);
          reportedDecls.set(blockEndDecl);
          reportedDecls.set(inlineEndDecl);
        }
      }
    },
  );
});
