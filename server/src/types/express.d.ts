// (we cant directly access Request type .user without this)

// import 'express'; — A bare side-effect import. We don't use anything from express directly here; we just need TS to load Express's types so we can hook into them. (Without this, the Express namespace below wouldn't exist.)
import "express";
//declare global — "Add stuff to the global type space." Anything inside affects every file in the project, no import needed.
declare global {
  //namespace Express { interface Request { ... } } — Express's types are organized under a namespace called Express, and they specifically declare Request as an interface. Why does that matter? Because interfaces in TS are open. When two files both declare interface Request, TS merges them — your fields get added to the existing one rather than replacing it. This is called declaration merging, and it's the secret sauce.
  namespace Express {
    interface Request {
      user?: string;
      roles?: string[];
    }
  }
}

// .d.ts extension — declaration file. Pure types, zero runtime code. TS picks it up automatically because include: ["src/**/*"] matches it.
