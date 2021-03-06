///<reference path='refs.ts'/>

module TDev {

  export module Embedded {

    import J = AST.Json

    export module Helpers {
      export var librarySymbol = "♻";

      var kStringType = "shared_ptr<string>";

      export function mangleName(name: string) {
        return name.replace(/\W/g, "_");
      }

      // Compute a unique name from a user-provided name and a
      // TouchDevelop-generated unique id.
      export function mangle(name: string, id: string) {
          return mangleName(name) + "_" + mangleName(id);
      }

      export function mangleDef(d: J.JLocalDef) {
          return mangle(d.name, d.id);
      }

      export function mangleRef(d: J.JLocalRef) {
          return mangle(d.name, <any> d.localId);
      }

      // To stay as close as possible to the usual TouchDevelop semantics, we
      // pass scalar values by copy, and strings and arrays by reference (using
      // [shared_ptr]s).
      export function mkType(t: J.JTypeRef) {
        var t1: string = <any> t;
        switch (t1) {
          case "Number":
            return "int";
          case "String":
            return kStringType;
          case "Boolean":
            return "bool";
          default:
            throw new Error("Unsupported type: " + t1);
        }
        // unreachable
        return null;
      }

      export function mkParam(p: J.JLocalDef) {
        return mkType(p.type)+" "+mangleDef(p);
      }

      export function mkSignature(name: string, inParams: J.JLocalDef[], outParams: J.JLocalDef[]) {
        if (outParams.length > 1)
          throw new Error("Not supported (multiple return parameters)");
        var retType = outParams.length ? mkType(outParams[0].type) : "void";
        return [
          retType, " ", name, "(",
          inParams.map(mkParam).join(", "),
          ")",
        ].join("");
      }

      // Generate the return instruction for the function.  Currently uses
      // [return], but XXX will change later when in CPS. Possibly parameterized
      // over whether we're in an atomic action or not.
      export function mkReturn(exprCode: string) {
        return "return "+exprCode+";";
      }
    }
  }
}

// vim: set ts=2 sw=2 sts=2:
