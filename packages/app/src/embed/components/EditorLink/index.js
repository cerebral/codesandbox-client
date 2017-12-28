import React from 'react';

import Logo from 'common/components/Logo';

import { sandboxUrl } from 'common/utils/url-generator';

import { Text, EditText } from './elements';

function EditorLink({ sandbox, small }) {
  return (
    <EditText
      small={small}
      target="_blank"
      rel="noopener noreferrer"
      href={`${sandboxUrl(sandbox)}?from-embed`}
    >
      <Text small={small}>Edit on CodeSandbox</Text>
      <Logo />
    </EditText>
  );
}

export default EditorLink;
