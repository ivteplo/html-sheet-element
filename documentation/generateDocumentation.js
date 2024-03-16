#!/usr/bin/env deno
//
// Copyright (c) 2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { doc as readJSDoc } from "https://deno.land/x/deno_doc@0.117.0/mod.ts"
import * as path from "https://deno.land/std@0.207.0/path/mod.ts"

async function main() {
  const inputFile = new URL("../library/sheet.jsx", import.meta.url).toString()
  const outputFile = path.fromFileUrl(new URL("./API.md", import.meta.url))

  const documentationInJSON = await readJSDoc(inputFile)

  const documentationInMarkdown = documentationInJSON
    .filter(DocumentationGenerator.isObjectDocumentationToBeDisplayed)
    .map(object => DocumentationGenerator.generate(object))
    .join("\n\n\n")

  await Deno.writeTextFile(outputFile, documentationInMarkdown)
}

class Markdown {
  /**
   * @param {string} name
   * @param {number} level
   */
  static title(name, level = 1) {
    return "#".repeat(Math.max(level, 1)) + " " + name
  }

  /**
   * @param {string} name
   * @param {string} information
   */
  static property(name, information) {
    return `*${name}*: ${information}`
  }
}

function join(items, separator = "\n") {
  return (Array.isArray(items) && items || [])
    .filter(Boolean)
    .map(string => string.trim())
    .join(separator)
}

class DocumentationGenerator {
  static generateFunctionArgumentDocumentation(argument, functionTags) {
    let result = argument.name

    if (argument.optional) {
      result += "?"
    }

    const paramDocumentation = functionTags
      .find(tag => tag.kind === "param" && tag.name === argument.name)

    if (paramDocumentation) {
      result += `: ${paramDocumentation.type}`
    }

    return result
  }

  static generateObjectName(object) {
    let name = object.name

    switch (object.kind) {
      case "getter":
      case "setter":
        name = `${object.kind === "getter" ? "get" : "set"} ${name}`
      case "function":
      case "method":
        if (object.functionDef.isAsync) {
          name = `async ${name}`
        }

        name += "(" + object.functionDef.params.map(argument => this.generateFunctionArgumentDocumentation(argument, object.jsDoc.tags)) + ")"
        name += ": " + (object.functionDef.returnType?.repr ?? object.jsDoc.tags.find(tag => tag.kind === "return")?.type ?? "unknown")
        break
    }

    return name
  }

  static generateTags(object) {
    if (!object.jsDoc?.tags) {
      object.jsDoc ??= {}
      object.jsDoc.tags = []
    }

    if (["function", "method", "getter", "setter"].indexOf(object.kind) !== -1) {
      object.jsDoc.tags = object.jsDoc.tags.filter(tag => tag.kind !== "param" && tag.kind !== "return")
    }

    return object.jsDoc.tags.map(
      tag => Markdown.property(join([tag.kind, tag.name], " "), tag?.doc ?? tag?.type ?? "")
    )
  }

  static generate(object, deepnessLevel = 1) {
    return join([
      join([
        Markdown.title(this.generateObjectName(object), deepnessLevel),
        object.jsDoc?.doc,
        ...this.generateTags(object),
      ]),
      ...(object.classDef?.methods.map(method => this.generate(method, deepnessLevel + 1)) ?? []),
    ], "\n\n")
  }

  static isObjectDocumentationToBeDisplayed(object) {
    return object.name !== "default" && object.declarationKind === "export"
  }
}

await main()
