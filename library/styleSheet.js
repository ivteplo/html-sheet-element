//
// Copyright (c) 2022-2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

export const styleSheet = new CSSStyleSheet()
export default styleSheet

styleSheet.replaceSync(`
  :host {
    --_sheet-foreground-color: var(--sheet-foreground-color, inherit);
    --_sheet-background-color: var(--sheet-background-color, #fff);

    --_sheet-border-radius: var(--sheet-border-radius, 1rem);

    --_sheet-min-width: var(--sheet-min-width, 18rem);
    --_sheet-width: var(--sheet-width, 90vw);
    --_sheet-max-width: var(--sheet-max-width, auto);

    --_sheet-min-height: var(--sheet-min-height, 30vh);
    --_sheet-height: var(--sheet-height, auto);
    --_sheet-max-height: var(--sheet-max-height, 100vh);

    --_sheet-scale-down-to: 0.5;
    --_sheet-z-index: var(--sheet-z-index, 1);
    --_sheet-transition-duration: var(--sheet-transition-duration, 0.5s);

    --_sheet-backdrop-color: var(--sheet-backdrop-color, #88888880);

    --_sheet-header-padding: var(--sheet-header-padding, 0 0 0 1rem);
    --_sheet-title-margin: var(--sheet-title-margin, 0.5rem 0);
    --_sheet-body-padding: var(--sheet-body-padding, 1rem);

    --_sheet-handle-width: var(--sheet-handle-width, 3rem);
    --_sheet-handle-height: var(--sheet-handle-height, 0.25rem);
    --_sheet-handle-color: var(--sheet-handle-color, #eee);
    --_sheet-handle-border-radius: var(--sheet-handle-border-radius, 0.125rem);
    --_sheet-handle-container-padding: var(--sheet-handle-container-padding, 1rem);
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --_sheet-background-color: var(--sheet-background-color, black);
      --_sheet-foreground-color: var(--sheet-foreground-color, white);
      --_sheet-handle-color: var(--sheet-handle-color, #333333);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      --_sheet-transition-duration: var(--sheet-transition-duration, 0.1s);
    }
  }

  /* tablet */
  @media (min-width: 48rem) {
    :host {
      --_sheet-width: var(--sheet-width, auto);
      --_sheet-max-width: var(--sheet-max-width, 48rem);
      --_sheet-max-height: var(--sheet-max-height, 32rem);
    }
  }

  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: var(--_sheet-z-index);

    transition:
      opacity var(--_sheet-transition-duration),
      visibility var(--_sheet-transition-duration);
  }

  :host(:not([open])) {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  /* ::backdrop is not supported :( */
  .sheet-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--_sheet-backdrop-color);
  }

  .sheet-contents {
    display: flex;
    flex-direction: column;

    border-radius: var(--_sheet-border-radius) var(--_sheet-border-radius) 0 0;

    background: var(--_sheet-background-color);

    overflow-y: hidden;

    transform: translateY(0) scale(1);

    min-width: var(--_sheet-min-width);
    width: var(--_sheet-width);
    max-width: var(--_sheet-max-width);

    min-height: var(--_sheet-min-height);
    height: var(--_sheet-height);
    max-height: var(--_sheet-max-height);

    box-sizing: border-box;

    transition:
      transform var(--_sheet-transition-duration),
      border-radius var(--_sheet-transition-duration);
  }

  :host(:not([open])) .sheet-contents {
    transform: translateY(100%) scale(var(--_sheet-scale-down-to));
  }

  .sheet-contents.is-resized {
    user-select: none;
  }

  .sheet-controls {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: stretch;
    padding: var(--_sheet-header-padding);
  }

  .sheet-title-area {
    display: flex;
    justify-content: flex-start;
  }

  .sheet-title-area:not(:empty) {
    padding: var(--_sheet-title-margin);
  }

  .sheet-handle-container {
    display: flex;
    flex-direction: column;
    justify-content: center;

    min-height: var(--_sheet-handle-height);
    height: 100%;

    padding: var(--_sheet-handle-container-padding);
    box-sizing: border-box;

    margin: auto;
    cursor: grab;
  }

  .sheet-handle {
    width: var(--_sheet-handle-width);
    height: var(--_sheet-handle-height);
    background: var(--_sheet-handle-color);
    border-radius: var(--_sheet-handle-border-radius);
  }

  .sheet-button-area {
    display: flex;
    justify-content: flex-end;
  }

  .sheet-close-button {
    border: none;
    padding: 0.7rem;
    background: transparent;
    cursor: pointer;
    color: inherit;
    font-weight: 500;
  }

  .sheet-body {
    flex-grow: 1;
    height: 100%;

    display: flex;
    flex-direction: column;

    overflow-y: auto;

    padding: var(--_sheet-body-padding);
    box-sizing: border-box;
  }

  /* tablet */
  @media (min-width: 48rem) {
    :host {
      justify-content: center;
    }

    .sheet-contents {
      border-radius: var(--_sheet-border-radius);
    }

    .sheet-handle-container {
      display: none;
    }

    .sheet-controls {
      grid-template-columns: 1fr auto auto;
    }
  }
`)
