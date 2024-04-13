//
// Copyright (c) 2022-2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

export const styleSheet = new CSSStyleSheet()
export default styleSheet

styleSheet.replaceSync(`
  :host {
    --overlay-color: #88888880;
    --sheet-background-color: #fff;
    --sheet-thumb-color: #eee;
    --sheet-transition-duration: 0.5s;
    --sheet-border-radius: 1rem;
    --sheet-header-padding: 0 0 0 1rem;
    --sheet-body-padding: 1rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;

    transition:
      opacity var(--sheet-transition-duration),
      visibility var(--sheet-transition-duration);
  }

  :host(:not([open])) {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --sheet-background-color: black;
      --sheet-foreground-color: white;
      --sheet-thumb-color: #333333;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      --sheet-transition-duration: 0.1s;
    }
  }

  /* ::backdrop is not supported :( */
  .sheet-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--overlay-color);
  }

  .sheet-contents {
    display: flex;
    flex-direction: column;

    border-radius: var(--sheet-border-radius) var(--sheet-border-radius) 0 0;

    background: var(--sheet-background-color);

    overflow-y: hidden;

    transform: translateY(0) scale(1);

    min-width: 18rem;
    width: 90vw;

    min-height: 30vh;
    max-height: 100vh;

    box-sizing: border-box;

    --scale-down-to: 0.5;

    transition:
      transform var(--sheet-transition-duration),
      border-radius var(--sheet-transition-duration);
  }

  :host(:not([open])) .sheet-contents {
    transform: translateY(100%) scale(var(--scale-down-to));
  }

  .sheet-contents.is-resized {
    user-select: none;
  }

  .sheet-controls {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: stretch;
    padding: var(--sheet-header-padding);
  }

  .sheet-title-area {
    display: flex;
    justify-content: flex-start;
  }

  .sheet-draggable-area {
    width: 3rem;
    margin: auto;
    padding: 1rem;
    cursor: grab;
  }

  .sheet-draggable-thumb {
    width:inherit;
    height: 0.25rem;
    background: var(--sheet-thumb-color);
    border-radius: 0.125rem;
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

    padding: var(--sheet-body-padding);
    box-sizing: border-box;
  }

  /* tablet */
  @media (min-width: 48rem) {
    :host {
      justify-content: center;
    }

    .sheet-contents {
      width: auto;
      max-width: 48rem;
      max-height: 32rem;
      border-radius: var(--sheet-border-radius);
    }

    .sheet-draggable-area {
      display: none;
    }

    .sheet-controls {
      grid-template-columns: 1fr auto auto;
    }
  }
`)
