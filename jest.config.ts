import type {Config} from 'jest';
import defaults from 'jest-preset-angular/presets';

const esModules = ['@angular'];

export default async (): Promise<Config> => {
  return {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist'],
    rootDir: '.',
    moduleDirectories: ['node_modules', 'src'],
    transform: {
      '^.+\\.(ts|js|mjs|html|svg)$': [
        'jest-preset-angular',
        {
          ...defaults.defaultTransformerOptions,
          tsconfig: './src/tsconfig.spec.json',
          isolatedModules: true
        }
      ]
    },
    globalSetup: 'jest-preset-angular/global-setup',
    preset: 'ts-jest',
    transformIgnorePatterns: [
      `<rootDir>/node_modules/(?!.*\\.mjs$|${esModules.join('|')})`
    ]
  };
};
