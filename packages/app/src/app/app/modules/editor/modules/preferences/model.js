import { types } from 'mobx-state-tree';

export default {
  settings: types.model({
    prettifyOnSaveEnabled: types.boolean,
    autoCompleteEnabled: types.boolean,
    autoDownloadTypes: types.boolean,
    clearConsoleEnabled: types.boolean,
    codeMirror: types.boolean,
    fontFamily: types.string,
    fontSize: types.number,
    livePreviewEnabled: types.boolean,
    clearConsoleEnabled: types.boolean,
    instantPreviewEnabled: types.boolean,
    keybindings: types.model({}),
    lineHeight: types.number,
    lintEnabled: types.boolean,
    livePreviewEnabled: types.boolean,
    newPackagerExperiment: types.boolean,
    prettierConfig: types.model({
      printWidth: types.number,
      tabWidth: types.number,
      useTabs: types.boolean,
      semi: types.boolean,
      singleQuote: types.boolean,
      trailingComma: types.string,
      bracketSpacing: types.boolean,
      jsxBracketSameLine: types.boolean,
    }),
    jsxBracketSameLine: types.boolean,
    printWidth: types.number,
    semi: types.boolean,
    singleQuote: types.boolean,
    tabWidth: types.number,
    trailingComma: types.string,
    useTabs: types.boolean,
    prettifyOnSaveEnabled: types.boolean,
    vimMode: types.boolean,
    zenMode: types.boolean,
  }),
  isLoadingPaymentDetails: types.boolean,
  itemIndex: types.number,
  showEditor: types.boolean,
  showPreview: types.boolean,
  paymentDetailError: types.maybe(types.string),
  paymentDetails: types.maybe(
    types.model({
      brand: types.string,
      expMonth: types.number,
      expYear: types.number,
      last4: types.string,
      name: types.string,
    })
  ),
};
