import stylelint from 'stylelint';
import { messages } from '../messages';
import ruleName from '../ruleName';

export const isMethodIndifferent = (method) => method === 'ignore' || method === false || method === null;

export const isMethodAlways = (method) => method === 'always' || method === true;

export const isContextAutofixing = (context) => Boolean(Object(context).fix);

export const isNodeMatchingDecl = (decl, regexp) => decl.type === 'decl' && regexp.test(decl.prop);

export const isDeclAnException = (decl, propExceptions) => propExceptions
  .some((match) => (match instanceof RegExp
    ? match.test(decl.prop)
    : String(match || '').toLowerCase() === String(decl.prop || '').toLowerCase()));

export const isDeclReported = (decl, reportedDecls) => reportedDecls.has(decl);

export const createReporters = (result) => ({
  reportUnexpectedProperty: (decl, logicalProperty) => stylelint.utils.report({
    message: messages.unexpectedProp(decl.prop, logicalProperty),
    node: decl,
    result,
    ruleName,
  }),
  reportUnsupportedProp: (decl, logicalProperty) => stylelint.utils.report({
    message: messages.unsupportedProp(decl.prop, logicalProperty),
    node: decl,
    result,
    ruleName,
  }),
  reportUnexpectedValue: (node, value) => stylelint.utils.report({
    message: messages.unexpectedValue(node.prop, node.value, value),
    node,
    result,
    ruleName,
  }),
});

export { validateRuleWithProps } from './validateRuleWithProps';

export { walk } from './walk';
