import {
  getAddonsLoaderCode,
  nameFromPackage,
} from '../src/addon-registry/create-addons-loader';
import { describe, expect, test } from 'vitest';

describe('create-addons-loader code generation', () => {
  test('no addon creates simple loader, default = no loadProjectConfig', () => {
    const code = getAddonsLoaderCode([]);
    expect(code).toBe(`/*
Don't change this file manually.
It is autogenerated by @plone/registry.
Instead, change the "addons" registration in the app.
*/

const addonsInfo = {};
export { addonsInfo };

const safeWrapper = (func) => (config) => {
  const res = func(config);
  if (typeof res === 'undefined') {
    throw new Error("Configuration function doesn't return config");
  }
  return res;
}

const load = (config) => {
  const addonLoaders = [];
  if(!addonLoaders.every((el) => typeof el === "function")) {
    throw new TypeError(
      'Each addon has to provide a function applying its configuration to the projects configuration.',
    );
  }
  return addonLoaders.reduce((acc, apply) => safeWrapper(apply)(acc), config);
};
export default load;
`);
  });

  test('no addon creates simple loader, loadProjectConfig set to true', () => {
    const code = getAddonsLoaderCode([], {}, true);
    expect(code).toBe(`/*
Don't change this file manually.
It is autogenerated by @plone/registry.
Instead, change the "addons" registration in the app.
*/

const addonsInfo = {};
export { addonsInfo };

const safeWrapper = (func) => (config) => {
  const res = func(config);
  if (typeof res === 'undefined') {
    throw new Error("Configuration function doesn't return config");
  }
  return res;
}

const load = (config) => {
  const addonLoaders = [];
  if(!addonLoaders.every((el) => typeof el === "function")) {
    throw new TypeError(
      'Each addon has to provide a function applying its configuration to the projects configuration.',
    );
  }
  return addonLoaders.reduce((acc, apply) => safeWrapper(apply)(acc), config);
};
export default load;
`);
  });

  test('one addon creates loader', () => {
    const code = getAddonsLoaderCode(['volto-addon1']);
    expect(code.indexOf("import voltoAddon1 from 'volto-addon1';") > 0).toBe(
      true,
    );
  });

  test('two addons create loaders', () => {
    const code = getAddonsLoaderCode(['volto-addon1', 'volto-addon2']);
    expect(
      code.indexOf(`
import voltoAddon1 from 'volto-addon1';
import voltoAddon2 from 'volto-addon2';`) > 0,
    ).toBe(true);
  });

  test('one addons plus one extra creates loader', () => {
    const code = getAddonsLoaderCode(['volto-addon1:loadExtra1']);
    expect(
      code.indexOf(`
import voltoAddon1, { loadExtra1 as loadExtra10 } from 'volto-addon1';
`) > 0,
    ).toBe(true);
  });

  test('one addons plus two extras creates loader', () => {
    const code = getAddonsLoaderCode(['volto-addon1:loadExtra1,loadExtra2']);
    expect(
      code.indexOf(`
import voltoAddon1, { loadExtra1 as loadExtra10, loadExtra2 as loadExtra21 } from 'volto-addon1';
`) > 0,
    ).toBe(true);
  });

  test('two addons plus extras creates loader', () => {
    const code = getAddonsLoaderCode([
      'volto-addon1:loadExtra1,loadExtra2',
      'volto-addon2:loadExtra3,loadExtra4',
    ]);
    expect(
      code.indexOf(`
import voltoAddon1, { loadExtra1 as loadExtra10, loadExtra2 as loadExtra21 } from 'volto-addon1';
import voltoAddon2, { loadExtra3 as loadExtra32, loadExtra4 as loadExtra43 } from 'volto-addon2';
`) > 0,
    ).toBe(true);
  });
});

describe('create-addons-loader default name generation', () => {
  const getName = nameFromPackage;

  test('passing a simple word returns a word', () => {
    expect(getName('something')).toBe('something');
  });

  test('passing a kebab-name returns a word', () => {
    expect(getName('volto-something-else')).toBe('voltoSomethingElse');
  });

  test('passing a simple relative path returns random string', () => {
    const rand = getName('../../');
    expect(rand.length).toBe(10);
    expect(new RegExp(/[abcdefghjk]+/).exec(rand)[0].length > 0).toBe(true);
  });
  test('passing a tilda relative path with addon strips tilda', () => {
    const name = getName('~/addons/volto-addon1');
    expect(name).toBe('addonsvoltoAddon1');
  });
  test('passing a namespace package strips @', () => {
    const name = getName('@plone/volto-addon1');
    expect(name).toBe('plonevoltoAddon1');
  });
  test('passing a tilda relative path strips tilda', () => {
    const name = getName('~/../');
    expect(name.length).toBe(10);
    expect(new RegExp(/[abcdefghjk]+/).exec(name)[0].length > 0).toBe(true);
  });
  test('passing a backspaced path strips backspace', () => {
    const name = getName('c:\\nodeprojects');
    expect(name).toBe('cnodeprojects');
  });
});
