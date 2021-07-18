import { physicalProp } from '../maps';
import { validateRuleWithProps, isDeclAnException, isDeclReported } from '../helpers';

export const handleProperty = ({
  node, isAutofix, reportedDecls, propExceptions, reportUnexpectedProperty, dir,
}) => physicalProp(dir).forEach(([props, prop]) => {
  validateRuleWithProps(node, props, (physicalDecl) => {
    if (!isDeclAnException(physicalDecl, propExceptions)) {
      if (isAutofix) {
        if (Array.isArray(prop)) {
          const { value } = physicalDecl;
          const [blockValue, inlineValue] = (() => {
            const values = value.split(' ');
            if (values.length === 1) {
              return [value, value];
            }

            if (values.length === 2) {
              const [block, inline] = values;
              return [block, inline];
            }

            if (values.length === 3) {
              const [blockStart, inline, blockEnd] = values;
              return [[blockStart, blockEnd].join(' '), inline];
            }

            if (values.length === 4) {
              const [blockStart, inlineEnd, blockEnd, inlineStart] = values;
              return [[blockStart, blockEnd].join(' '), [inlineStart, inlineEnd].join(' ')];
            }

            return [];
          })();

          physicalDecl.cloneBefore({
            prop: prop[0],
            value: blockValue,
          });
          physicalDecl.cloneBefore({
            prop: prop[1],
            value: inlineValue,
          });

          physicalDecl.remove();

          return;
        }

        // eslint-disable-next-line no-param-reassign
        physicalDecl.prop = prop;
      } else if (!isDeclReported(physicalDecl, reportedDecls)) {
        reportUnexpectedProperty(physicalDecl, prop);

        reportedDecls.set(physicalDecl);
      }
    }
  });
});
