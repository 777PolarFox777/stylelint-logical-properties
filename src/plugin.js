import stylelint from 'stylelint';
import ruleName from './ruleName';
import {
  createReporters,
  isContextAutofixing,
  isMethodAlways,
  isMethodIndifferent,
  walk,
} from './helpers';
import {
  handle2Properties, handle4Properties, handleNonStandardProperties, handleProperty, handleValue,
} from './handlers';

const reportedDecls = new WeakMap();

export const plugin = (method, opts, context) => {
  const propExceptions = [].concat(Object(opts).except || []);
  const isAutofix = isContextAutofixing(context);
  const dir = /^rtl$/i.test(Object(opts).direction) ? 'rtl' : 'ltr';

  return (root, result) => {
    // validate the method
    const isMethodValid = stylelint.utils.validateOptions(result, ruleName, {
      actual: method,
      possible() {
        return isMethodIndifferent(method)
          || isMethodAlways(method);
      },
    });

    const {
      reportUnexpectedProperty,
      reportUnsupportedProp,
      reportUnexpectedValue,
    } = createReporters(result);

    if (isMethodValid && isMethodAlways(method)) {
      walk(root, (node) => {
        // MIGRATION from out of date props https://github.com/csstools/stylelint-use-logical/issues/1
        handleNonStandardProperties({
          node, isAutofix, reportedDecls, reportUnsupportedProp,
        });

        // validate or autofix 4 physical properties as logical shorthands
        handle4Properties({
          node, isAutofix, reportedDecls, reportUnexpectedProperty, propExceptions,
        });

        // validate or autofix 2 physical properties as logical shorthands
        handle2Properties({
          node, isAutofix, reportedDecls, reportUnexpectedProperty, propExceptions,
        });

        // validate or autofix physical properties as logical
        handleProperty({
          node, isAutofix, reportedDecls, reportUnexpectedProperty, propExceptions, dir,
        });

        // validate or autofix physical values as logical
        handleValue({
          node, isAutofix, reportedDecls, reportUnexpectedValue, propExceptions, dir,
        });
      });
    }
  };
};
