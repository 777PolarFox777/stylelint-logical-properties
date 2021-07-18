import {
  migrationNoneSpec, physical2Prop, physical4Prop, physicalProp, physicalValue,
} from './maps';
import { messages } from './messages';

const baseOptions = {
  ruleName: 'stylelint-logical-properties/enforce-logical-properties',
  fix: true,
};

jest.spyOn(console, 'warn').mockImplementation(() => {});

const propsToString = (props, values) => props.reduce((acc, prop, index) => `${acc} ${prop}: ${values[index]}; `, '');

const convertToTests = ({
  cases, oldValues, newValues, createMessage,
}) => cases.map(([oldProps, newProps]) => {
  if (oldProps instanceof RegExp) {
    const prop = oldProps.toString().slice(0, -1).replace(/[/^$]/g, '');
    const endValue = newProps[oldValues[0]];

    return {
      code: `body { ${propsToString([prop], [oldValues[0]])} }`,
      fixed: `body { ${propsToString([prop], [endValue])} }`,
      description: `Expect "${oldValues[0]}" to be "${endValue}" in property "${prop}"}`,
      warnings: [{
        message: createMessage(prop, oldValues[0], endValue),
      }],
    };
  }

  const newPropsArray = [].concat(newProps);

  return {
    code: `body { ${propsToString(oldProps, oldValues)} }`,
    fixed: `body { ${propsToString(newPropsArray, newValues)} }`,
    description: `Expect property "${oldProps[0]}" to be "${newPropsArray}"`,
    warnings: [{
      message: createMessage(oldProps[0], newProps),
    }],
  };
});

const migrationTests = [
  ...convertToTests({
    cases: migrationNoneSpec,
    createMessage: (physical, logical) => messages.unsupportedProp(physical, logical),
    oldValues: ['10px'],
    newValues: ['10px', '10px'],
  }),
  ...convertToTests({
    cases: migrationNoneSpec,
    createMessage: (physical, logical) => messages.unsupportedProp(physical, logical),
    oldValues: ['10px 20px'],
    newValues: ['10px', '20px'],
  }),
];

const physical4PropTests = [
  ...convertToTests({
    cases: [physical4Prop[0]],
    createMessage: (physical, logical) => messages.unexpectedProp(physical, logical),
    oldValues: ['1px', '2px', '3px', '4px'],
    newValues: ['1px 2px 3px 4px'],
  }),
  ...convertToTests({
    cases: physical4Prop.slice(1),
    createMessage: (physical, logical) => messages.unexpectedProp(physical, logical),
    oldValues: ['1px', '2px', '3px', '4px'],
    newValues: ['1px 3px', '4px 2px'],
  })];

const physical2PropTests = [
  ...convertToTests({
    cases: physical2Prop,
    createMessage: (physical, logical) => messages.unexpectedProp(physical, logical),
    oldValues: ['1px', '2px'],
    newValues: ['1px 2px'],
  }),
  ...convertToTests({
    cases: physical2Prop,
    createMessage: (physical, logical) => messages.unexpectedProp(physical, logical),
    oldValues: ['2px', '2px'],
    newValues: ['2px'],
  })];

const physicalPropTests = [
  ...convertToTests({
    cases: physicalProp('ltr'),
    createMessage: (physical, logical) => messages.unexpectedProp(physical, logical),
    oldValues: ['1px'],
    newValues: ['1px', '1px'],
  }),
  ...convertToTests({
    cases: physicalProp('ltr').filter(([key]) => key === 'margin' || key === 'padding'),
    createMessage: (physical, logical) => messages.unexpectedProp(physical, logical),
    oldValues: ['1px 2px 3px 4px'],
    newValues: ['1px 3px', '4px 2px'],
  }),
];

const physicalValueTests = [
  ...convertToTests({
    cases: physicalValue('ltr'),
    createMessage: (prop, physical, logical) => messages.unexpectedValue(prop, physical, logical),
    oldValues: ['left'],
    newValues: ['inline-start'],
  }),
  ...convertToTests({
    cases: physicalValue('ltr'),
    createMessage: (prop, physical, logical) => messages.unexpectedValue(prop, physical, logical),
    oldValues: ['right'],
  }),
];

testRule({
  ...baseOptions,
  config: ['always'],

  accept: [
    {
      code: 'body:dir(ltr) { top: 0; margin-left: 0; float: left }',
    },
  ],

  reject: [
    ...migrationTests,
    ...physical4PropTests,
    ...physical2PropTests,
    ...physicalPropTests,
    ...physicalValueTests,
  ],
});

testRule({
  ...baseOptions,
  config: ['always', { except: 'left' }],

  accept: [
    {
      code: 'body { left: 0 }',
      description: 'Skip ignored properties',
    },
  ],
});

testRule({
  ...baseOptions,
  config: ['always', { except: ['top', /^margin/] }],

  accept: [
    {
      code: 'body { top: 0; margin-left: 0 }',
      description: 'Skip ignored properties',
    },
  ],
});

testRule({
  ...baseOptions,
  config: ['always', { except: ['margin-top', 'margin-bottom'] }],

  accept: [
    {
      code: 'body { margin-top: 0.5rem; margin-bottom: 0.5rem; }',
      description: 'Skip ignored properties',
    },
  ],
});

testRule({
  ...baseOptions,
  config: ['always', {
    except: [/^float$/i],
  }],

  reject: [
    {
      code: 'body { float: left; text-align: left }',
      fixed: 'body { float: left; text-align: start }',
      description: 'Skip ignored properties and fix the rest',
      message: messages.unexpectedValue('text-align', 'left', 'start'),
    },
  ],
});
