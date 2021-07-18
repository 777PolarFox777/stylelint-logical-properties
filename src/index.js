import stylelint from 'stylelint';
import ruleName from './ruleName';
import { plugin } from './plugin';

export default stylelint.createPlugin(ruleName, plugin);

export { ruleName };
