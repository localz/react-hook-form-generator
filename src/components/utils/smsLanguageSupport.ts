import { Monaco } from '@monaco-editor/react';

type Range = {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
};

function createDependencyProposals({
  range,
  monaco,
}: {
  range: Range;
  monaco: Monaco;
}) {
  return [
    /*
     * Order variables
     */
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.deliveryName}}',
      insertText: '{{.order.deliveryName}}',
      detail: `Example: Jane\n
  Customer name`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.deliveryPhone}}',
      insertText: '{{.order.deliveryPhone}}',
      detail: `Example: +61400000001\n
  Customer phone number`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.orderNumber}}',
      insertText: '{{.order.orderNumber}}',
      detail: `Example: 1700001\n
  Order number`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.grouping}}',
      insertText: '{{.order.grouping}}',
      detail: `Example: route1\n
  Order grouping/route - used for delivery orders`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.sequence}}',
      insertText: '{{.order.sequence}}',
      detail: `Example: 1\n
  Sequence for order in a grouping/route - used for delivery orders`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.allocatedUser.firstName}}',
      insertText: '{{.order.allocatedUser.firstName}}',
      detail: `Example: Alice\n
  First name of the user servicing the order`,
      tooltip: ``,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.allocatedUser.lastName}}',
      insertText: '{{.order.allocatedUser.lastName}}',
      detail: `Example: Weaver\n
  Last name of the user servicing the order`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.pickupLocation}}',
      insertText: '{{.order.pickupLocation}}',
      detail: `Example: 1000\n
  Store number for order pickup - used for collection orders`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.secondaryReference}}',
      insertText: '{{.order.secondaryReference}}',
      detail: `Example: external-1001\n
  External reference ID for an order
            `,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.specific.trackId}}',
      insertText: '{{.order.specific.trackId}}',
      detail: `Example: ac120yd/n
  ID for tracking the order
  `,
    },

    /*
     * Project variables
     */
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.context.projectConfig.urlShorteners.omw.fullPath}}',
      insertText:
        '{{printf "%s%s%s" .context.projectConfig.urlShorteners.omw.fullPath "/" .order.specific.trackId}}',
      detail: `Example: https://s.localz.io/a/ac120yd
  Order tracking URL`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.context.projectConfig.countryCode}}',
      insertText: '{{.context.projectConfig.countryCode}}',
      detail: `Example: GB\n
  Country code configured for the project`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.context.projectConfig.langCode}}',
      insertText: '{{.context.projectConfig.langCode}}',
      detail: `Example: en\n
  Language code configured for the project`,
    },

    /*
     * Date variables
     */
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.orderDate}}',
      insertText: '{{.order.orderDate}}',
      detail: `Example: 2021-02-01T03:08:14.261Z/n
  Order date in UTC`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.completed}}',
      insertText: '{{.order.completed}}',
      detail: `Example: 2021-02-01T03:08:14.261Z/n
  Order completion date in UTC`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.pickupStart}}',
      insertText: '{{.order.pickupStart}}',
      detail: `Example: 2021-02-01T03:08:14.261Z/n
  Start of order time window in UTC`,
    },
    {
      range: range,
      kind: monaco.languages.CompletionItemKind.Reference,
      label: '{{.order.pickupEnd}}',
      insertText: '{{.order.pickupEnd}}',
      detail: `Example: 2021-02-01T03:08:14.261Z/n
  End of order time window in UTC`,
    },
  ];
}

export function registerSmsLanguageSupport({
  monaco,
  colorMode,
}: {
  monaco: Monaco;
  colorMode: 'light' | 'dark';
}) {
  monaco.languages.register({ id: 'sms' });

  monaco.languages.setMonarchTokensProvider('sms', {
    tokenizer: {
      root: [[/\{\{.*?\}\}/, 'template-variable']],
    },
  });

  monaco.editor.defineTheme('sms-theme', {
    base: colorMode === 'light' ? 'vs' : 'vs-dark',
    inherit: true,
    rules: [
      { token: 'template-variable', foreground: '004c97', fontStyle: 'bold' },
    ],
    colors: {},
  });

  return monaco.languages.registerCompletionItemProvider('sms', {
    provideCompletionItems: function(model, position) {
      const word = model.getWordUntilPosition(position);

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = createDependencyProposals({
        range,
        monaco,
      });

      return {
        suggestions,
      };
    },
  });
}
