//
// Copyright (c) 2022-2023 Ivan Teplov
// Licensed under the Apache license 2.0
//

const eventHandlerAttributePattern = /^on([A-Z][a-zA-Z]*)$/

/**
 * @param {string} tagName
 * @param {Record<string, string|function>} attributes
 * @param {HTMLElement|string|number|bigint} children
 */
export function createElement(tagName, attributes, ...children) {
  const element = document.createElement(tagName)

  for (const [attribute, value] of Object.entries(attributes)) {
    const eventHandlerPatternMatches = attribute.match(eventHandlerAttributePattern)

    if (eventHandlerPatternMatches) {
      const event = eventHandlerPatternMatches[1].toLowerCase()
      element.addEventListener(event, value)
    } else if (attribute === "reference") {
      value(element)
    } else {
      element.setAttribute(attribute, value)
    }
  }

  for (const child of children) {
    switch (typeof child) {
      case "undefined":
        break
      case "string":
      case "number":
      case "bigint":
        element.appendChild(document.createTextNode(String(child)))
        break
      case "object":
        if (child === null) {
          break
        }

        if (child instanceof HTMLElement) {
          element.appendChild(child)
          break
        }

        // Note: if the child is not of type HTMLElement,
        // we will go into the default handler too
      default:
        throw new Error("Unexpected type of child: " + typeof child)
    }
  }

  return element
}

export default createElement
