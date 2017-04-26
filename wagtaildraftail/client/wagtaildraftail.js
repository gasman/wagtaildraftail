import React from 'react';
import ReactDOM from 'react-dom';
import { Entity } from 'draft-js';
import DraftailEditor from 'draftail';

import 'draftail/dist/draftail.css';
import './wagtaildraftail.css';

import decorators from './decorators';
import sources from './sources';
import registry from './registry';

// Register default Decorators and Sources
registry.registerDecorators(decorators);
registry.registerSources(sources);

const initDraftailEditor = (fieldName, options = {}) => {
  const field = document.querySelector(`[name="${fieldName}"]`);
  const editorWrapper = document.createElement('div');
  field.parentNode.appendChild(editorWrapper);

  const serialiseInputValue = (rawContentState) => {
    field.value = JSON.stringify(rawContentState);
  };

  if (options.entityTypes) {
    // eslint-disable-next-line no-param-reassign
    options.entityTypes = options.entityTypes.map(entity => Object.assign(entity, {
      source: registry.getSource(entity.source),
      strategy: registry.getStrategy(entity.type) || null,
      decorator: registry.getDecorator(entity.decorator),
    }));
  }

  const editor = (
    <DraftailEditor
      rawContentState={JSON.parse(field.value)}
      onSave={serialiseInputValue}
      {...options}
    />
  );

  ReactDOM.render(editor, editorWrapper);
};

window.wagtailDraftail = {};
window.wagtailDraftail.initEditor = initDraftailEditor;
Object.assign(window.wagtailDraftail, registry);

// Expose basic React methods for basic needs
window.wagtailDraftail.createClass = React.createClass;
window.wagtailDraftail.createElement = React.createElement;

export default initDraftailEditor;
