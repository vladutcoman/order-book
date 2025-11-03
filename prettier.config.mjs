/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  trailingComma: 'all',
  semi: true,
  endOfLine: 'lf',

  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss', // Must be last
  ],
  importOrder: [
    '<TYPES>',
    '<BUILTIN_MODULES>',
    '^react$',
    '^react/(.*)$',
    '^next/(.*)$',
    '^next$',
    '^@tanstack/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>^@/',
    '<TYPES>^lucide-react',
    '^lucide-react$',
    '^@/components/ui/(.*)$',
    '^@/components/(.*)$',
    '^@/hooks/(.*)$',
    '^@/lib/(.*)$',
    '^@/stores/(.*)$',
    '^@/utils/(.*)$',
    '^@/types/(.*)$',
    '^@/(.*)$',
    '',
    '<TYPES>^[./]',
    '^[./]',
  ],
  importOrderTypeScriptVersion: '5.9.3',
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
};

export default config;
