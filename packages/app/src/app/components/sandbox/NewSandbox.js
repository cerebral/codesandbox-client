import React from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import styled from 'styled-components';

import GithubIcon from 'react-icons/lib/go/mark-github';
import TerminalIcon from 'react-icons/lib/go/terminal';

import {
  newSandboxUrl,
  newReactTypeScriptSandboxUrl,
  newPreactSandboxUrl,
  newVueSandboxUrl,
  newSvelteSandboxUrl,
  importFromGitHubUrl,
  uploadFromCliUrl,
} from 'common/utils/url-generator';

import ReactIcon from 'common/components/logos/React';
import PreactIcon from 'common/components/logos/Preact';
import VueIcon from 'common/components/logos/Vue';
import SvelteIcon from 'common/components/logos/Svelte';
import Row from 'common/components/flex/Row';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background};
`;

const RowContainer = styled(Row)`
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  padding-top: 1.5rem;
  &:last-of-type {
    padding-bottom: 1.5rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: 0.3s ease all;
  opacity: 0.8;

  padding: 1.5rem 0;

  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const Text = styled.div`
  margin-top: 1rem;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  width: 140px;
  margin: 0 1rem;
`;
type LogoProps = {
  Icon: any,
  width: number,
  height: number,
  text: string,
  href: string,
  onClick: () => {},
};

const Logo = ({ Icon, width, height, text, href, onClick }: LogoProps) => (
  <LogoLink to={href} onClick={onClick}>
    <LogoContainer>
      <Icon width={width} height={height} />
      <Text>{text}</Text>
    </LogoContainer>
  </LogoLink>
);

function NewSandbox({ signals }) {
  return (
    <Container>
      <RowContainer>
        <Logo
          Icon={ReactIcon}
          width={50}
          height={50}
          text="React"
          href={newSandboxUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
        <Logo
          Icon={ReactIcon}
          width={50}
          height={50}
          text="React TypeScript"
          href={newReactTypeScriptSandboxUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
        <Logo
          Icon={PreactIcon}
          width={50}
          height={50}
          text="Preact"
          href={newPreactSandboxUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
        <Logo
          Icon={VueIcon}
          width={50}
          height={50}
          text="Vue"
          href={newVueSandboxUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
        <Logo
          Icon={SvelteIcon}
          width={50}
          height={50}
          text="Svelte"
          href={newSvelteSandboxUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
      </RowContainer>
      <RowContainer>
        <Logo
          Icon={GithubIcon}
          width={50}
          height={50}
          text="Import from Github"
          href={importFromGitHubUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
        <Logo
          Icon={TerminalIcon}
          width={50}
          height={50}
          text="Upload from CLI"
          href={uploadFromCliUrl()}
          onClick={() => signals.editor.newSandboxModalClosed()}
        />
      </RowContainer>
    </Container>
  );
}

export default inject('signals')(NewSandbox);
