import { migrationNoneSpec } from '../maps';
import { validateRuleWithProps, isDeclReported } from '../helpers';

export const handleNonStandardProperties = ({
  node, isAutofix, reportedDecls, reportUnsupportedProp,
}) => migrationNoneSpec
  .forEach(([prop, props]) => {
    validateRuleWithProps(node, prop, (outDateDecl) => {
      console.warn(`Property ${prop[0]} is not part of Logical standards.`);
      if (isAutofix) {
        console.warn(`Migrating ${prop[0]} to Logical standards.`);
        const { value } = outDateDecl;

        const values = value.split(' ');

        outDateDecl.cloneBefore({
          prop: props[0],
          value: values[0],
        });
        outDateDecl.cloneAfter({
          prop: props[1],
          value: values[1] || values[0],
        });
        outDateDecl.remove();
      } else if (!isDeclReported(outDateDecl, reportedDecls)) {
        reportUnsupportedProp(outDateDecl, props);
        reportedDecls.set(outDateDecl);
      }
    });
  });
