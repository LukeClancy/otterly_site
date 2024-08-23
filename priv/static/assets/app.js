var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/highlight.js/lib/core.js
var require_core = __commonJS((exports, module) => {
  var deepFreeze = function(obj) {
    if (obj instanceof Map) {
      obj.clear = obj.delete = obj.set = function() {
        throw new Error("map is read-only");
      };
    } else if (obj instanceof Set) {
      obj.add = obj.clear = obj.delete = function() {
        throw new Error("set is read-only");
      };
    }
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((name) => {
      const prop = obj[name];
      const type = typeof prop;
      if ((type === "object" || type === "function") && !Object.isFrozen(prop)) {
        deepFreeze(prop);
      }
    });
    return obj;
  };
  var escapeHTML = function(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  };
  var inherit$1 = function(original, ...objects) {
    const result = Object.create(null);
    for (const key in original) {
      result[key] = original[key];
    }
    objects.forEach(function(obj) {
      for (const key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  };
  var source = function(re) {
    if (!re)
      return null;
    if (typeof re === "string")
      return re;
    return re.source;
  };
  var lookahead = function(re) {
    return concat("(?=", re, ")");
  };
  var anyNumberOfTimes = function(re) {
    return concat("(?:", re, ")*");
  };
  var optional = function(re) {
    return concat("(?:", re, ")?");
  };
  var concat = function(...args) {
    const joined = args.map((x) => source(x)).join("");
    return joined;
  };
  var stripOptionsFromArgs = function(args) {
    const opts = args[args.length - 1];
    if (typeof opts === "object" && opts.constructor === Object) {
      args.splice(args.length - 1, 1);
      return opts;
    } else {
      return {};
    }
  };
  var either = function(...args) {
    const opts = stripOptionsFromArgs(args);
    const joined = "(" + (opts.capture ? "" : "?:") + args.map((x) => source(x)).join("|") + ")";
    return joined;
  };
  var countMatchGroups = function(re) {
    return new RegExp(re.toString() + "|").exec("").length - 1;
  };
  var startsWith = function(re, lexeme) {
    const match = re && re.exec(lexeme);
    return match && match.index === 0;
  };
  var _rewriteBackreferences = function(regexps, { joinWith }) {
    let numCaptures = 0;
    return regexps.map((regex) => {
      numCaptures += 1;
      const offset = numCaptures;
      let re = source(regex);
      let out = "";
      while (re.length > 0) {
        const match = BACKREF_RE.exec(re);
        if (!match) {
          out += re;
          break;
        }
        out += re.substring(0, match.index);
        re = re.substring(match.index + match[0].length);
        if (match[0][0] === "\\" && match[1]) {
          out += "\\" + String(Number(match[1]) + offset);
        } else {
          out += match[0];
          if (match[0] === "(") {
            numCaptures++;
          }
        }
      }
      return out;
    }).map((re) => `(${re})`).join(joinWith);
  };
  var skipIfHasPrecedingDot = function(match, response) {
    const before = match.input[match.index - 1];
    if (before === ".") {
      response.ignoreMatch();
    }
  };
  var scopeClassName = function(mode, _parent) {
    if (mode.className !== undefined) {
      mode.scope = mode.className;
      delete mode.className;
    }
  };
  var beginKeywords = function(mode, parent) {
    if (!parent)
      return;
    if (!mode.beginKeywords)
      return;
    mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)";
    mode.__beforeBegin = skipIfHasPrecedingDot;
    mode.keywords = mode.keywords || mode.beginKeywords;
    delete mode.beginKeywords;
    if (mode.relevance === undefined)
      mode.relevance = 0;
  };
  var compileIllegal = function(mode, _parent) {
    if (!Array.isArray(mode.illegal))
      return;
    mode.illegal = either(...mode.illegal);
  };
  var compileMatch = function(mode, _parent) {
    if (!mode.match)
      return;
    if (mode.begin || mode.end)
      throw new Error("begin & end are not supported with match");
    mode.begin = mode.match;
    delete mode.match;
  };
  var compileRelevance = function(mode, _parent) {
    if (mode.relevance === undefined)
      mode.relevance = 1;
  };
  var compileKeywords = function(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
    const compiledKeywords = Object.create(null);
    if (typeof rawKeywords === "string") {
      compileList(scopeName, rawKeywords.split(" "));
    } else if (Array.isArray(rawKeywords)) {
      compileList(scopeName, rawKeywords);
    } else {
      Object.keys(rawKeywords).forEach(function(scopeName2) {
        Object.assign(compiledKeywords, compileKeywords(rawKeywords[scopeName2], caseInsensitive, scopeName2));
      });
    }
    return compiledKeywords;
    function compileList(scopeName2, keywordList) {
      if (caseInsensitive) {
        keywordList = keywordList.map((x) => x.toLowerCase());
      }
      keywordList.forEach(function(keyword) {
        const pair = keyword.split("|");
        compiledKeywords[pair[0]] = [scopeName2, scoreForKeyword(pair[0], pair[1])];
      });
    }
  };
  var scoreForKeyword = function(keyword, providedScore) {
    if (providedScore) {
      return Number(providedScore);
    }
    return commonKeyword(keyword) ? 0 : 1;
  };
  var commonKeyword = function(keyword) {
    return COMMON_KEYWORDS.includes(keyword.toLowerCase());
  };
  var remapScopeNames = function(mode, regexes, { key }) {
    let offset = 0;
    const scopeNames = mode[key];
    const emit = {};
    const positions = {};
    for (let i = 1;i <= regexes.length; i++) {
      positions[i + offset] = scopeNames[i];
      emit[i + offset] = true;
      offset += countMatchGroups(regexes[i - 1]);
    }
    mode[key] = positions;
    mode[key]._emit = emit;
    mode[key]._multi = true;
  };
  var beginMultiClass = function(mode) {
    if (!Array.isArray(mode.begin))
      return;
    if (mode.skip || mode.excludeBegin || mode.returnBegin) {
      error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
      throw MultiClassError;
    }
    if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
      error("beginScope must be object");
      throw MultiClassError;
    }
    remapScopeNames(mode, mode.begin, { key: "beginScope" });
    mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
  };
  var endMultiClass = function(mode) {
    if (!Array.isArray(mode.end))
      return;
    if (mode.skip || mode.excludeEnd || mode.returnEnd) {
      error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
      throw MultiClassError;
    }
    if (typeof mode.endScope !== "object" || mode.endScope === null) {
      error("endScope must be object");
      throw MultiClassError;
    }
    remapScopeNames(mode, mode.end, { key: "endScope" });
    mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
  };
  var scopeSugar = function(mode) {
    if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
      mode.beginScope = mode.scope;
      delete mode.scope;
    }
  };
  var MultiClass = function(mode) {
    scopeSugar(mode);
    if (typeof mode.beginScope === "string") {
      mode.beginScope = { _wrap: mode.beginScope };
    }
    if (typeof mode.endScope === "string") {
      mode.endScope = { _wrap: mode.endScope };
    }
    beginMultiClass(mode);
    endMultiClass(mode);
  };
  var compileLanguage = function(language) {
    function langRe(value, global) {
      return new RegExp(source(value), "m" + (language.case_insensitive ? "i" : "") + (language.unicodeRegex ? "u" : "") + (global ? "g" : ""));
    }

    class MultiRegex {
      constructor() {
        this.matchIndexes = {};
        this.regexes = [];
        this.matchAt = 1;
        this.position = 0;
      }
      addRule(re, opts) {
        opts.position = this.position++;
        this.matchIndexes[this.matchAt] = opts;
        this.regexes.push([opts, re]);
        this.matchAt += countMatchGroups(re) + 1;
      }
      compile() {
        if (this.regexes.length === 0) {
          this.exec = () => null;
        }
        const terminators = this.regexes.map((el) => el[1]);
        this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: "|" }), true);
        this.lastIndex = 0;
      }
      exec(s) {
        this.matcherRe.lastIndex = this.lastIndex;
        const match = this.matcherRe.exec(s);
        if (!match) {
          return null;
        }
        const i = match.findIndex((el, i2) => i2 > 0 && el !== undefined);
        const matchData = this.matchIndexes[i];
        match.splice(0, i);
        return Object.assign(match, matchData);
      }
    }

    class ResumableMultiRegex {
      constructor() {
        this.rules = [];
        this.multiRegexes = [];
        this.count = 0;
        this.lastIndex = 0;
        this.regexIndex = 0;
      }
      getMatcher(index) {
        if (this.multiRegexes[index])
          return this.multiRegexes[index];
        const matcher = new MultiRegex;
        this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
        matcher.compile();
        this.multiRegexes[index] = matcher;
        return matcher;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      addRule(re, opts) {
        this.rules.push([re, opts]);
        if (opts.type === "begin")
          this.count++;
      }
      exec(s) {
        const m = this.getMatcher(this.regexIndex);
        m.lastIndex = this.lastIndex;
        let result = m.exec(s);
        if (this.resumingScanAtSamePosition()) {
          if (result && result.index === this.lastIndex)
            ;
          else {
            const m2 = this.getMatcher(0);
            m2.lastIndex = this.lastIndex + 1;
            result = m2.exec(s);
          }
        }
        if (result) {
          this.regexIndex += result.position + 1;
          if (this.regexIndex === this.count) {
            this.considerAll();
          }
        }
        return result;
      }
    }
    function buildModeRegex(mode) {
      const mm = new ResumableMultiRegex;
      mode.contains.forEach((term) => mm.addRule(term.begin, { rule: term, type: "begin" }));
      if (mode.terminatorEnd) {
        mm.addRule(mode.terminatorEnd, { type: "end" });
      }
      if (mode.illegal) {
        mm.addRule(mode.illegal, { type: "illegal" });
      }
      return mm;
    }
    function compileMode(mode, parent) {
      const cmode = mode;
      if (mode.isCompiled)
        return cmode;
      [
        scopeClassName,
        compileMatch,
        MultiClass,
        beforeMatchExt
      ].forEach((ext) => ext(mode, parent));
      language.compilerExtensions.forEach((ext) => ext(mode, parent));
      mode.__beforeBegin = null;
      [
        beginKeywords,
        compileIllegal,
        compileRelevance
      ].forEach((ext) => ext(mode, parent));
      mode.isCompiled = true;
      let keywordPattern = null;
      if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
        mode.keywords = Object.assign({}, mode.keywords);
        keywordPattern = mode.keywords.$pattern;
        delete mode.keywords.$pattern;
      }
      keywordPattern = keywordPattern || /\w+/;
      if (mode.keywords) {
        mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
      }
      cmode.keywordPatternRe = langRe(keywordPattern, true);
      if (parent) {
        if (!mode.begin)
          mode.begin = /\B|\b/;
        cmode.beginRe = langRe(cmode.begin);
        if (!mode.end && !mode.endsWithParent)
          mode.end = /\B|\b/;
        if (mode.end)
          cmode.endRe = langRe(cmode.end);
        cmode.terminatorEnd = source(cmode.end) || "";
        if (mode.endsWithParent && parent.terminatorEnd) {
          cmode.terminatorEnd += (mode.end ? "|" : "") + parent.terminatorEnd;
        }
      }
      if (mode.illegal)
        cmode.illegalRe = langRe(mode.illegal);
      if (!mode.contains)
        mode.contains = [];
      mode.contains = [].concat(...mode.contains.map(function(c) {
        return expandOrCloneMode(c === "self" ? mode : c);
      }));
      mode.contains.forEach(function(c) {
        compileMode(c, cmode);
      });
      if (mode.starts) {
        compileMode(mode.starts, parent);
      }
      cmode.matcher = buildModeRegex(cmode);
      return cmode;
    }
    if (!language.compilerExtensions)
      language.compilerExtensions = [];
    if (language.contains && language.contains.includes("self")) {
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    }
    language.classNameAliases = inherit$1(language.classNameAliases || {});
    return compileMode(language);
  };
  var dependencyOnParent = function(mode) {
    if (!mode)
      return false;
    return mode.endsWithParent || dependencyOnParent(mode.starts);
  };
  var expandOrCloneMode = function(mode) {
    if (mode.variants && !mode.cachedVariants) {
      mode.cachedVariants = mode.variants.map(function(variant) {
        return inherit$1(mode, { variants: null }, variant);
      });
    }
    if (mode.cachedVariants) {
      return mode.cachedVariants;
    }
    if (dependencyOnParent(mode)) {
      return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
    }
    if (Object.isFrozen(mode)) {
      return inherit$1(mode);
    }
    return mode;
  };

  class Response {
    constructor(mode) {
      if (mode.data === undefined)
        mode.data = {};
      this.data = mode.data;
      this.isMatchIgnored = false;
    }
    ignoreMatch() {
      this.isMatchIgnored = true;
    }
  }
  var SPAN_CLOSE = "</span>";
  var emitsWrappingTags = (node) => {
    return !!node.scope;
  };
  var scopeToCSSClass = (name, { prefix }) => {
    if (name.startsWith("language:")) {
      return name.replace("language:", "language-");
    }
    if (name.includes(".")) {
      const pieces = name.split(".");
      return [
        `${prefix}${pieces.shift()}`,
        ...pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`)
      ].join(" ");
    }
    return `${prefix}${name}`;
  };

  class HTMLRenderer {
    constructor(parseTree, options) {
      this.buffer = "";
      this.classPrefix = options.classPrefix;
      parseTree.walk(this);
    }
    addText(text) {
      this.buffer += escapeHTML(text);
    }
    openNode(node) {
      if (!emitsWrappingTags(node))
        return;
      const className = scopeToCSSClass(node.scope, { prefix: this.classPrefix });
      this.span(className);
    }
    closeNode(node) {
      if (!emitsWrappingTags(node))
        return;
      this.buffer += SPAN_CLOSE;
    }
    value() {
      return this.buffer;
    }
    span(className) {
      this.buffer += `<span class="${className}">`;
    }
  }
  var newNode = (opts = {}) => {
    const result = { children: [] };
    Object.assign(result, opts);
    return result;
  };

  class TokenTree {
    constructor() {
      this.rootNode = newNode();
      this.stack = [this.rootNode];
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    add(node) {
      this.top.children.push(node);
    }
    openNode(scope) {
      const node = newNode({ scope });
      this.add(node);
      this.stack.push(node);
    }
    closeNode() {
      if (this.stack.length > 1) {
        return this.stack.pop();
      }
      return;
    }
    closeAllNodes() {
      while (this.closeNode())
        ;
    }
    toJSON() {
      return JSON.stringify(this.rootNode, null, 4);
    }
    walk(builder) {
      return this.constructor._walk(builder, this.rootNode);
    }
    static _walk(builder, node) {
      if (typeof node === "string") {
        builder.addText(node);
      } else if (node.children) {
        builder.openNode(node);
        node.children.forEach((child) => this._walk(builder, child));
        builder.closeNode(node);
      }
      return builder;
    }
    static _collapse(node) {
      if (typeof node === "string")
        return;
      if (!node.children)
        return;
      if (node.children.every((el) => typeof el === "string")) {
        node.children = [node.children.join("")];
      } else {
        node.children.forEach((child) => {
          TokenTree._collapse(child);
        });
      }
    }
  }

  class TokenTreeEmitter extends TokenTree {
    constructor(options) {
      super();
      this.options = options;
    }
    addText(text) {
      if (text === "") {
        return;
      }
      this.add(text);
    }
    startScope(scope) {
      this.openNode(scope);
    }
    endScope() {
      this.closeNode();
    }
    __addSublanguage(emitter, name) {
      const node = emitter.root;
      if (name)
        node.scope = `language:${name}`;
      this.add(node);
    }
    toHTML() {
      const renderer = new HTMLRenderer(this, this.options);
      return renderer.value();
    }
    finalize() {
      this.closeAllNodes();
      return true;
    }
  }
  var BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  var MATCH_NOTHING_RE = /\b\B/;
  var IDENT_RE = "[a-zA-Z]\\w*";
  var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
  var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
  var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
  var BINARY_NUMBER_RE = "\\b(0b[01]+)";
  var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
  var SHEBANG = (opts = {}) => {
    const beginShebang = /^#![ ]*\//;
    if (opts.binary) {
      opts.begin = concat(beginShebang, /.*\b/, opts.binary, /\b.*/);
    }
    return inherit$1({
      scope: "meta",
      begin: beginShebang,
      end: /$/,
      relevance: 0,
      "on:begin": (m, resp) => {
        if (m.index !== 0)
          resp.ignoreMatch();
      }
    }, opts);
  };
  var BACKSLASH_ESCAPE = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  };
  var APOS_STRING_MODE = {
    scope: "string",
    begin: "\'",
    end: "\'",
    illegal: "\\n",
    contains: [BACKSLASH_ESCAPE]
  };
  var QUOTE_STRING_MODE = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [BACKSLASH_ESCAPE]
  };
  var PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  };
  var COMMENT = function(begin, end, modeOptions = {}) {
    const mode = inherit$1({
      scope: "comment",
      begin,
      end,
      contains: []
    }, modeOptions);
    mode.contains.push({
      scope: "doctag",
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: true,
      relevance: 0
    });
    const ENGLISH_WORD = either("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
    mode.contains.push({
      begin: concat(/[ ]+/, "(", ENGLISH_WORD, /[.]?[:]?([.][ ]|[ ])/, "){3}")
    });
    return mode;
  };
  var C_LINE_COMMENT_MODE = COMMENT("//", "$");
  var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
  var HASH_COMMENT_MODE = COMMENT("#", "$");
  var NUMBER_MODE = {
    scope: "number",
    begin: NUMBER_RE,
    relevance: 0
  };
  var C_NUMBER_MODE = {
    scope: "number",
    begin: C_NUMBER_RE,
    relevance: 0
  };
  var BINARY_NUMBER_MODE = {
    scope: "number",
    begin: BINARY_NUMBER_RE,
    relevance: 0
  };
  var REGEXP_MODE = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      BACKSLASH_ESCAPE,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [BACKSLASH_ESCAPE]
      }
    ]
  };
  var TITLE_MODE = {
    scope: "title",
    begin: IDENT_RE,
    relevance: 0
  };
  var UNDERSCORE_TITLE_MODE = {
    scope: "title",
    begin: UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  var METHOD_GUARD = {
    begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  var END_SAME_AS_BEGIN = function(mode) {
    return Object.assign(mode, {
      "on:begin": (m, resp) => {
        resp.data._beginMatch = m[1];
      },
      "on:end": (m, resp) => {
        if (resp.data._beginMatch !== m[1])
          resp.ignoreMatch();
      }
    });
  };
  var MODES = Object.freeze({
    __proto__: null,
    APOS_STRING_MODE,
    BACKSLASH_ESCAPE,
    BINARY_NUMBER_MODE,
    BINARY_NUMBER_RE,
    COMMENT,
    C_BLOCK_COMMENT_MODE,
    C_LINE_COMMENT_MODE,
    C_NUMBER_MODE,
    C_NUMBER_RE,
    END_SAME_AS_BEGIN,
    HASH_COMMENT_MODE,
    IDENT_RE,
    MATCH_NOTHING_RE,
    METHOD_GUARD,
    NUMBER_MODE,
    NUMBER_RE,
    PHRASAL_WORDS_MODE,
    QUOTE_STRING_MODE,
    REGEXP_MODE,
    RE_STARTERS_RE,
    SHEBANG,
    TITLE_MODE,
    UNDERSCORE_IDENT_RE,
    UNDERSCORE_TITLE_MODE
  });
  var beforeMatchExt = (mode, parent) => {
    if (!mode.beforeMatch)
      return;
    if (mode.starts)
      throw new Error("beforeMatch cannot be used with starts");
    const originalMode = Object.assign({}, mode);
    Object.keys(mode).forEach((key) => {
      delete mode[key];
    });
    mode.keywords = originalMode.keywords;
    mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
    mode.starts = {
      relevance: 0,
      contains: [
        Object.assign(originalMode, { endsParent: true })
      ]
    };
    mode.relevance = 0;
    delete originalMode.beforeMatch;
  };
  var COMMON_KEYWORDS = [
    "of",
    "and",
    "for",
    "in",
    "not",
    "or",
    "if",
    "then",
    "parent",
    "list",
    "value"
  ];
  var DEFAULT_KEYWORD_SCOPE = "keyword";
  var seenDeprecations = {};
  var error = (message) => {
    console.error(message);
  };
  var warn = (message, ...args) => {
    console.log(`WARN: ${message}`, ...args);
  };
  var deprecated = (version2, message) => {
    if (seenDeprecations[`${version2}/${message}`])
      return;
    console.log(`Deprecated as of ${version2}. ${message}`);
    seenDeprecations[`${version2}/${message}`] = true;
  };
  var MultiClassError = new Error;
  var version = "11.9.0";

  class HTMLInjectionError extends Error {
    constructor(reason, html) {
      super(reason);
      this.name = "HTMLInjectionError";
      this.html = html;
    }
  }
  var escape = escapeHTML;
  var inherit = inherit$1;
  var NO_MATCH = Symbol("nomatch");
  var MAX_KEYWORD_HITS = 7;
  var HLJS = function(hljs) {
    const languages = Object.create(null);
    const aliases = Object.create(null);
    const plugins = [];
    let SAFE_MODE = true;
    const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
    const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: "Plain text", contains: [] };
    let options = {
      ignoreUnescapedHTML: false,
      throwUnescapedHTML: false,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      __emitter: TokenTreeEmitter
    };
    function shouldNotHighlight(languageName) {
      return options.noHighlightRe.test(languageName);
    }
    function blockLanguage(block) {
      let classes = block.className + " ";
      classes += block.parentNode ? block.parentNode.className : "";
      const match = options.languageDetectRe.exec(classes);
      if (match) {
        const language = getLanguage(match[1]);
        if (!language) {
          warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
          warn("Falling back to no-highlight mode for this block.", block);
        }
        return language ? match[1] : "no-highlight";
      }
      return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
    }
    function highlight2(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
      let code = "";
      let languageName = "";
      if (typeof optionsOrCode === "object") {
        code = codeOrLanguageName;
        ignoreIllegals = optionsOrCode.ignoreIllegals;
        languageName = optionsOrCode.language;
      } else {
        deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
        deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
        languageName = codeOrLanguageName;
        code = optionsOrCode;
      }
      if (ignoreIllegals === undefined) {
        ignoreIllegals = true;
      }
      const context = {
        code,
        language: languageName
      };
      fire("before:highlight", context);
      const result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals);
      result.code = context.code;
      fire("after:highlight", result);
      return result;
    }
    function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
      const keywordHits = Object.create(null);
      function keywordData(mode, matchText) {
        return mode.keywords[matchText];
      }
      function processKeywords() {
        if (!top.keywords) {
          emitter.addText(modeBuffer);
          return;
        }
        let lastIndex = 0;
        top.keywordPatternRe.lastIndex = 0;
        let match = top.keywordPatternRe.exec(modeBuffer);
        let buf = "";
        while (match) {
          buf += modeBuffer.substring(lastIndex, match.index);
          const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
          const data = keywordData(top, word);
          if (data) {
            const [kind, keywordRelevance] = data;
            emitter.addText(buf);
            buf = "";
            keywordHits[word] = (keywordHits[word] || 0) + 1;
            if (keywordHits[word] <= MAX_KEYWORD_HITS)
              relevance += keywordRelevance;
            if (kind.startsWith("_")) {
              buf += match[0];
            } else {
              const cssClass = language.classNameAliases[kind] || kind;
              emitKeyword(match[0], cssClass);
            }
          } else {
            buf += match[0];
          }
          lastIndex = top.keywordPatternRe.lastIndex;
          match = top.keywordPatternRe.exec(modeBuffer);
        }
        buf += modeBuffer.substring(lastIndex);
        emitter.addText(buf);
      }
      function processSubLanguage() {
        if (modeBuffer === "")
          return;
        let result2 = null;
        if (typeof top.subLanguage === "string") {
          if (!languages[top.subLanguage]) {
            emitter.addText(modeBuffer);
            return;
          }
          result2 = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
          continuations[top.subLanguage] = result2._top;
        } else {
          result2 = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
        }
        if (top.relevance > 0) {
          relevance += result2.relevance;
        }
        emitter.__addSublanguage(result2._emitter, result2.language);
      }
      function processBuffer() {
        if (top.subLanguage != null) {
          processSubLanguage();
        } else {
          processKeywords();
        }
        modeBuffer = "";
      }
      function emitKeyword(keyword, scope) {
        if (keyword === "")
          return;
        emitter.startScope(scope);
        emitter.addText(keyword);
        emitter.endScope();
      }
      function emitMultiClass(scope, match) {
        let i = 1;
        const max = match.length - 1;
        while (i <= max) {
          if (!scope._emit[i]) {
            i++;
            continue;
          }
          const klass = language.classNameAliases[scope[i]] || scope[i];
          const text = match[i];
          if (klass) {
            emitKeyword(text, klass);
          } else {
            modeBuffer = text;
            processKeywords();
            modeBuffer = "";
          }
          i++;
        }
      }
      function startNewMode(mode, match) {
        if (mode.scope && typeof mode.scope === "string") {
          emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
        }
        if (mode.beginScope) {
          if (mode.beginScope._wrap) {
            emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
            modeBuffer = "";
          } else if (mode.beginScope._multi) {
            emitMultiClass(mode.beginScope, match);
            modeBuffer = "";
          }
        }
        top = Object.create(mode, { parent: { value: top } });
        return top;
      }
      function endOfMode(mode, match, matchPlusRemainder) {
        let matched = startsWith(mode.endRe, matchPlusRemainder);
        if (matched) {
          if (mode["on:end"]) {
            const resp = new Response(mode);
            mode["on:end"](match, resp);
            if (resp.isMatchIgnored)
              matched = false;
          }
          if (matched) {
            while (mode.endsParent && mode.parent) {
              mode = mode.parent;
            }
            return mode;
          }
        }
        if (mode.endsWithParent) {
          return endOfMode(mode.parent, match, matchPlusRemainder);
        }
      }
      function doIgnore(lexeme) {
        if (top.matcher.regexIndex === 0) {
          modeBuffer += lexeme[0];
          return 1;
        } else {
          resumeScanAtSamePosition = true;
          return 0;
        }
      }
      function doBeginMatch(match) {
        const lexeme = match[0];
        const newMode = match.rule;
        const resp = new Response(newMode);
        const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
        for (const cb of beforeCallbacks) {
          if (!cb)
            continue;
          cb(match, resp);
          if (resp.isMatchIgnored)
            return doIgnore(lexeme);
        }
        if (newMode.skip) {
          modeBuffer += lexeme;
        } else {
          if (newMode.excludeBegin) {
            modeBuffer += lexeme;
          }
          processBuffer();
          if (!newMode.returnBegin && !newMode.excludeBegin) {
            modeBuffer = lexeme;
          }
        }
        startNewMode(newMode, match);
        return newMode.returnBegin ? 0 : lexeme.length;
      }
      function doEndMatch(match) {
        const lexeme = match[0];
        const matchPlusRemainder = codeToHighlight.substring(match.index);
        const endMode = endOfMode(top, match, matchPlusRemainder);
        if (!endMode) {
          return NO_MATCH;
        }
        const origin = top;
        if (top.endScope && top.endScope._wrap) {
          processBuffer();
          emitKeyword(lexeme, top.endScope._wrap);
        } else if (top.endScope && top.endScope._multi) {
          processBuffer();
          emitMultiClass(top.endScope, match);
        } else if (origin.skip) {
          modeBuffer += lexeme;
        } else {
          if (!(origin.returnEnd || origin.excludeEnd)) {
            modeBuffer += lexeme;
          }
          processBuffer();
          if (origin.excludeEnd) {
            modeBuffer = lexeme;
          }
        }
        do {
          if (top.scope) {
            emitter.closeNode();
          }
          if (!top.skip && !top.subLanguage) {
            relevance += top.relevance;
          }
          top = top.parent;
        } while (top !== endMode.parent);
        if (endMode.starts) {
          startNewMode(endMode.starts, match);
        }
        return origin.returnEnd ? 0 : lexeme.length;
      }
      function processContinuations() {
        const list = [];
        for (let current = top;current !== language; current = current.parent) {
          if (current.scope) {
            list.unshift(current.scope);
          }
        }
        list.forEach((item) => emitter.openNode(item));
      }
      let lastMatch = {};
      function processLexeme(textBeforeMatch, match) {
        const lexeme = match && match[0];
        modeBuffer += textBeforeMatch;
        if (lexeme == null) {
          processBuffer();
          return 0;
        }
        if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
          modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
          if (!SAFE_MODE) {
            const err = new Error(`0 width match regex (${languageName})`);
            err.languageName = languageName;
            err.badRule = lastMatch.rule;
            throw err;
          }
          return 1;
        }
        lastMatch = match;
        if (match.type === "begin") {
          return doBeginMatch(match);
        } else if (match.type === "illegal" && !ignoreIllegals) {
          const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || "<unnamed>") + '"');
          err.mode = top;
          throw err;
        } else if (match.type === "end") {
          const processed = doEndMatch(match);
          if (processed !== NO_MATCH) {
            return processed;
          }
        }
        if (match.type === "illegal" && lexeme === "") {
          return 1;
        }
        if (iterations > 1e5 && iterations > match.index * 3) {
          const err = new Error("potential infinite loop, way more iterations than matches");
          throw err;
        }
        modeBuffer += lexeme;
        return lexeme.length;
      }
      const language = getLanguage(languageName);
      if (!language) {
        error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
        throw new Error('Unknown language: "' + languageName + '"');
      }
      const md = compileLanguage(language);
      let result = "";
      let top = continuation || md;
      const continuations = {};
      const emitter = new options.__emitter(options);
      processContinuations();
      let modeBuffer = "";
      let relevance = 0;
      let index = 0;
      let iterations = 0;
      let resumeScanAtSamePosition = false;
      try {
        if (!language.__emitTokens) {
          top.matcher.considerAll();
          for (;; ) {
            iterations++;
            if (resumeScanAtSamePosition) {
              resumeScanAtSamePosition = false;
            } else {
              top.matcher.considerAll();
            }
            top.matcher.lastIndex = index;
            const match = top.matcher.exec(codeToHighlight);
            if (!match)
              break;
            const beforeMatch = codeToHighlight.substring(index, match.index);
            const processedCount = processLexeme(beforeMatch, match);
            index = match.index + processedCount;
          }
          processLexeme(codeToHighlight.substring(index));
        } else {
          language.__emitTokens(codeToHighlight, emitter);
        }
        emitter.finalize();
        result = emitter.toHTML();
        return {
          language: languageName,
          value: result,
          relevance,
          illegal: false,
          _emitter: emitter,
          _top: top
        };
      } catch (err) {
        if (err.message && err.message.includes("Illegal")) {
          return {
            language: languageName,
            value: escape(codeToHighlight),
            illegal: true,
            relevance: 0,
            _illegalBy: {
              message: err.message,
              index,
              context: codeToHighlight.slice(index - 100, index + 100),
              mode: err.mode,
              resultSoFar: result
            },
            _emitter: emitter
          };
        } else if (SAFE_MODE) {
          return {
            language: languageName,
            value: escape(codeToHighlight),
            illegal: false,
            relevance: 0,
            errorRaised: err,
            _emitter: emitter,
            _top: top
          };
        } else {
          throw err;
        }
      }
    }
    function justTextHighlightResult(code) {
      const result = {
        value: escape(code),
        illegal: false,
        relevance: 0,
        _top: PLAINTEXT_LANGUAGE,
        _emitter: new options.__emitter(options)
      };
      result._emitter.addText(code);
      return result;
    }
    function highlightAuto(code, languageSubset) {
      languageSubset = languageSubset || options.languages || Object.keys(languages);
      const plaintext = justTextHighlightResult(code);
      const results = languageSubset.filter(getLanguage).filter(autoDetection).map((name) => _highlight(name, code, false));
      results.unshift(plaintext);
      const sorted = results.sort((a, b) => {
        if (a.relevance !== b.relevance)
          return b.relevance - a.relevance;
        if (a.language && b.language) {
          if (getLanguage(a.language).supersetOf === b.language) {
            return 1;
          } else if (getLanguage(b.language).supersetOf === a.language) {
            return -1;
          }
        }
        return 0;
      });
      const [best, secondBest] = sorted;
      const result = best;
      result.secondBest = secondBest;
      return result;
    }
    function updateClassName(element, currentLang, resultLang) {
      const language = currentLang && aliases[currentLang] || resultLang;
      element.classList.add("hljs");
      element.classList.add(`language-${language}`);
    }
    function highlightElement(element) {
      let node = null;
      const language = blockLanguage(element);
      if (shouldNotHighlight(language))
        return;
      fire("before:highlightElement", { el: element, language });
      if (element.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
        return;
      }
      if (element.children.length > 0) {
        if (!options.ignoreUnescapedHTML) {
          console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
          console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
          console.warn("The element with unescaped HTML:");
          console.warn(element);
        }
        if (options.throwUnescapedHTML) {
          const err = new HTMLInjectionError("One of your code blocks includes unescaped HTML.", element.innerHTML);
          throw err;
        }
      }
      node = element;
      const text = node.textContent;
      const result = language ? highlight2(text, { language, ignoreIllegals: true }) : highlightAuto(text);
      element.innerHTML = result.value;
      element.dataset.highlighted = "yes";
      updateClassName(element, language, result.language);
      element.result = {
        language: result.language,
        re: result.relevance,
        relevance: result.relevance
      };
      if (result.secondBest) {
        element.secondBest = {
          language: result.secondBest.language,
          relevance: result.secondBest.relevance
        };
      }
      fire("after:highlightElement", { el: element, result, text });
    }
    function configure(userOptions) {
      options = inherit(options, userOptions);
    }
    const initHighlighting = () => {
      highlightAll();
      deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function initHighlightingOnLoad() {
      highlightAll();
      deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let wantsHighlight = false;
    function highlightAll() {
      if (document.readyState === "loading") {
        wantsHighlight = true;
        return;
      }
      const blocks = document.querySelectorAll(options.cssSelector);
      blocks.forEach(highlightElement);
    }
    function boot() {
      if (wantsHighlight)
        highlightAll();
    }
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("DOMContentLoaded", boot, false);
    }
    function registerLanguage(languageName, languageDefinition) {
      let lang = null;
      try {
        lang = languageDefinition(hljs);
      } catch (error$1) {
        error("Language definition for '{}' could not be registered.".replace("{}", languageName));
        if (!SAFE_MODE) {
          throw error$1;
        } else {
          error(error$1);
        }
        lang = PLAINTEXT_LANGUAGE;
      }
      if (!lang.name)
        lang.name = languageName;
      languages[languageName] = lang;
      lang.rawDefinition = languageDefinition.bind(null, hljs);
      if (lang.aliases) {
        registerAliases(lang.aliases, { languageName });
      }
    }
    function unregisterLanguage(languageName) {
      delete languages[languageName];
      for (const alias of Object.keys(aliases)) {
        if (aliases[alias] === languageName) {
          delete aliases[alias];
        }
      }
    }
    function listLanguages() {
      return Object.keys(languages);
    }
    function getLanguage(name) {
      name = (name || "").toLowerCase();
      return languages[name] || languages[aliases[name]];
    }
    function registerAliases(aliasList, { languageName }) {
      if (typeof aliasList === "string") {
        aliasList = [aliasList];
      }
      aliasList.forEach((alias) => {
        aliases[alias.toLowerCase()] = languageName;
      });
    }
    function autoDetection(name) {
      const lang = getLanguage(name);
      return lang && !lang.disableAutodetect;
    }
    function upgradePluginAPI(plugin) {
      if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
        plugin["before:highlightElement"] = (data) => {
          plugin["before:highlightBlock"](Object.assign({ block: data.el }, data));
        };
      }
      if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
        plugin["after:highlightElement"] = (data) => {
          plugin["after:highlightBlock"](Object.assign({ block: data.el }, data));
        };
      }
    }
    function addPlugin(plugin) {
      upgradePluginAPI(plugin);
      plugins.push(plugin);
    }
    function removePlugin(plugin) {
      const index = plugins.indexOf(plugin);
      if (index !== -1) {
        plugins.splice(index, 1);
      }
    }
    function fire(event, args) {
      const cb = event;
      plugins.forEach(function(plugin) {
        if (plugin[cb]) {
          plugin[cb](args);
        }
      });
    }
    function deprecateHighlightBlock(el) {
      deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
      deprecated("10.7.0", "Please use highlightElement now.");
      return highlightElement(el);
    }
    Object.assign(hljs, {
      highlight: highlight2,
      highlightAuto,
      highlightAll,
      highlightElement,
      highlightBlock: deprecateHighlightBlock,
      configure,
      initHighlighting,
      initHighlightingOnLoad,
      registerLanguage,
      unregisterLanguage,
      listLanguages,
      getLanguage,
      registerAliases,
      autoDetection,
      inherit,
      addPlugin,
      removePlugin
    });
    hljs.debugMode = function() {
      SAFE_MODE = false;
    };
    hljs.safeMode = function() {
      SAFE_MODE = true;
    };
    hljs.versionString = version;
    hljs.regex = {
      concat,
      lookahead,
      either,
      optional,
      anyNumberOfTimes
    };
    for (const key in MODES) {
      if (typeof MODES[key] === "object") {
        deepFreeze(MODES[key]);
      }
    }
    Object.assign(hljs, MODES);
    return hljs;
  };
  var highlight = HLJS({});
  highlight.newInstance = () => HLJS({});
  module.exports = highlight;
  highlight.HighlightJS = highlight;
  highlight.default = highlight;
});

// assets/otterly/node_modules/morphdom/dist/morphdom-esm.js
var morphAttrs = function(fromNode, toNode) {
  var toNodeAttrs = toNode.attributes;
  var attr;
  var attrName;
  var attrNamespaceURI;
  var attrValue;
  var fromValue;
  if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
    return;
  }
  for (var i = toNodeAttrs.length - 1;i >= 0; i--) {
    attr = toNodeAttrs[i];
    attrName = attr.name;
    attrNamespaceURI = attr.namespaceURI;
    attrValue = attr.value;
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName;
      fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
      if (fromValue !== attrValue) {
        if (attr.prefix === "xmlns") {
          attrName = attr.name;
        }
        fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
      }
    } else {
      fromValue = fromNode.getAttribute(attrName);
      if (fromValue !== attrValue) {
        fromNode.setAttribute(attrName, attrValue);
      }
    }
  }
  var fromNodeAttrs = fromNode.attributes;
  for (var d = fromNodeAttrs.length - 1;d >= 0; d--) {
    attr = fromNodeAttrs[d];
    attrName = attr.name;
    attrNamespaceURI = attr.namespaceURI;
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName;
      if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
        fromNode.removeAttributeNS(attrNamespaceURI, attrName);
      }
    } else {
      if (!toNode.hasAttribute(attrName)) {
        fromNode.removeAttribute(attrName);
      }
    }
  }
};
var createFragmentFromTemplate = function(str) {
  var template = doc.createElement("template");
  template.innerHTML = str;
  return template.content.childNodes[0];
};
var createFragmentFromRange = function(str) {
  if (!range) {
    range = doc.createRange();
    range.selectNode(doc.body);
  }
  var fragment = range.createContextualFragment(str);
  return fragment.childNodes[0];
};
var createFragmentFromWrap = function(str) {
  var fragment = doc.createElement("body");
  fragment.innerHTML = str;
  return fragment.childNodes[0];
};
var toElement = function(str) {
  str = str.trim();
  if (HAS_TEMPLATE_SUPPORT) {
    return createFragmentFromTemplate(str);
  } else if (HAS_RANGE_SUPPORT) {
    return createFragmentFromRange(str);
  }
  return createFragmentFromWrap(str);
};
var compareNodeNames = function(fromEl, toEl) {
  var fromNodeName = fromEl.nodeName;
  var toNodeName = toEl.nodeName;
  var fromCodeStart, toCodeStart;
  if (fromNodeName === toNodeName) {
    return true;
  }
  fromCodeStart = fromNodeName.charCodeAt(0);
  toCodeStart = toNodeName.charCodeAt(0);
  if (fromCodeStart <= 90 && toCodeStart >= 97) {
    return fromNodeName === toNodeName.toUpperCase();
  } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
    return toNodeName === fromNodeName.toUpperCase();
  } else {
    return false;
  }
};
var createElementNS = function(name, namespaceURI) {
  return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
};
var moveChildren = function(fromEl, toEl) {
  var curChild = fromEl.firstChild;
  while (curChild) {
    var nextChild = curChild.nextSibling;
    toEl.appendChild(curChild);
    curChild = nextChild;
  }
  return toEl;
};
var syncBooleanAttrProp = function(fromEl, toEl, name) {
  if (fromEl[name] !== toEl[name]) {
    fromEl[name] = toEl[name];
    if (fromEl[name]) {
      fromEl.setAttribute(name, "");
    } else {
      fromEl.removeAttribute(name);
    }
  }
};
var noop = function() {
};
var defaultGetNodeKey = function(node) {
  if (node) {
    return node.getAttribute && node.getAttribute("id") || node.id;
  }
};
var morphdomFactory = function(morphAttrs2) {
  return function morphdom(fromNode, toNode, options) {
    if (!options) {
      options = {};
    }
    if (typeof toNode === "string") {
      if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
        var toNodeHtml = toNode;
        toNode = doc.createElement("html");
        toNode.innerHTML = toNodeHtml;
      } else {
        toNode = toElement(toNode);
      }
    } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
      toNode = toNode.firstElementChild;
    }
    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
    var onNodeAdded = options.onNodeAdded || noop;
    var onBeforeElUpdated = options.onBeforeElUpdated || noop;
    var onElUpdated = options.onElUpdated || noop;
    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
    var onNodeDiscarded = options.onNodeDiscarded || noop;
    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
    var skipFromChildren = options.skipFromChildren || noop;
    var addChild = options.addChild || function(parent, child) {
      return parent.appendChild(child);
    };
    var childrenOnly = options.childrenOnly === true;
    var fromNodesLookup = Object.create(null);
    var keyedRemovalList = [];
    function addKeyedRemoval(key) {
      keyedRemovalList.push(key);
    }
    function walkDiscardedChildNodes(node, skipKeyedNodes) {
      if (node.nodeType === ELEMENT_NODE) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = undefined;
          if (skipKeyedNodes && (key = getNodeKey(curChild))) {
            addKeyedRemoval(key);
          } else {
            onNodeDiscarded(curChild);
            if (curChild.firstChild) {
              walkDiscardedChildNodes(curChild, skipKeyedNodes);
            }
          }
          curChild = curChild.nextSibling;
        }
      }
    }
    function removeNode(node, parentNode, skipKeyedNodes) {
      if (onBeforeNodeDiscarded(node) === false) {
        return;
      }
      if (parentNode) {
        parentNode.removeChild(node);
      }
      onNodeDiscarded(node);
      walkDiscardedChildNodes(node, skipKeyedNodes);
    }
    function indexTree(node) {
      if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = getNodeKey(curChild);
          if (key) {
            fromNodesLookup[key] = curChild;
          }
          indexTree(curChild);
          curChild = curChild.nextSibling;
        }
      }
    }
    indexTree(fromNode);
    function handleNodeAdded(el) {
      onNodeAdded(el);
      var curChild = el.firstChild;
      while (curChild) {
        var nextSibling = curChild.nextSibling;
        var key = getNodeKey(curChild);
        if (key) {
          var unmatchedFromEl = fromNodesLookup[key];
          if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
            curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
            morphEl(unmatchedFromEl, curChild);
          } else {
            handleNodeAdded(curChild);
          }
        } else {
          handleNodeAdded(curChild);
        }
        curChild = nextSibling;
      }
    }
    function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
      while (curFromNodeChild) {
        var fromNextSibling = curFromNodeChild.nextSibling;
        if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
          addKeyedRemoval(curFromNodeKey);
        } else {
          removeNode(curFromNodeChild, fromEl, true);
        }
        curFromNodeChild = fromNextSibling;
      }
    }
    function morphEl(fromEl, toEl, childrenOnly2) {
      var toElKey = getNodeKey(toEl);
      if (toElKey) {
        delete fromNodesLookup[toElKey];
      }
      if (!childrenOnly2) {
        if (onBeforeElUpdated(fromEl, toEl) === false) {
          return;
        }
        morphAttrs2(fromEl, toEl);
        onElUpdated(fromEl);
        if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
          return;
        }
      }
      if (fromEl.nodeName !== "TEXTAREA") {
        morphChildren(fromEl, toEl);
      } else {
        specialElHandlers.TEXTAREA(fromEl, toEl);
      }
    }
    function morphChildren(fromEl, toEl) {
      var skipFrom = skipFromChildren(fromEl, toEl);
      var curToNodeChild = toEl.firstChild;
      var curFromNodeChild = fromEl.firstChild;
      var curToNodeKey;
      var curFromNodeKey;
      var fromNextSibling;
      var toNextSibling;
      var matchingFromEl;
      outer:
        while (curToNodeChild) {
          toNextSibling = curToNodeChild.nextSibling;
          curToNodeKey = getNodeKey(curToNodeChild);
          while (!skipFrom && curFromNodeChild) {
            fromNextSibling = curFromNodeChild.nextSibling;
            if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
              curToNodeChild = toNextSibling;
              curFromNodeChild = fromNextSibling;
              continue outer;
            }
            curFromNodeKey = getNodeKey(curFromNodeChild);
            var curFromNodeType = curFromNodeChild.nodeType;
            var isCompatible = undefined;
            if (curFromNodeType === curToNodeChild.nodeType) {
              if (curFromNodeType === ELEMENT_NODE) {
                if (curToNodeKey) {
                  if (curToNodeKey !== curFromNodeKey) {
                    if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                      if (fromNextSibling === matchingFromEl) {
                        isCompatible = false;
                      } else {
                        fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                        if (curFromNodeKey) {
                          addKeyedRemoval(curFromNodeKey);
                        } else {
                          removeNode(curFromNodeChild, fromEl, true);
                        }
                        curFromNodeChild = matchingFromEl;
                        curFromNodeKey = getNodeKey(curFromNodeChild);
                      }
                    } else {
                      isCompatible = false;
                    }
                  }
                } else if (curFromNodeKey) {
                  isCompatible = false;
                }
                isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                if (isCompatible) {
                  morphEl(curFromNodeChild, curToNodeChild);
                }
              } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                isCompatible = true;
                if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                  curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                }
              }
            }
            if (isCompatible) {
              curToNodeChild = toNextSibling;
              curFromNodeChild = fromNextSibling;
              continue outer;
            }
            if (curFromNodeKey) {
              addKeyedRemoval(curFromNodeKey);
            } else {
              removeNode(curFromNodeChild, fromEl, true);
            }
            curFromNodeChild = fromNextSibling;
          }
          if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
            if (!skipFrom) {
              addChild(fromEl, matchingFromEl);
            }
            morphEl(matchingFromEl, curToNodeChild);
          } else {
            var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
            if (onBeforeNodeAddedResult !== false) {
              if (onBeforeNodeAddedResult) {
                curToNodeChild = onBeforeNodeAddedResult;
              }
              if (curToNodeChild.actualize) {
                curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
              }
              addChild(fromEl, curToNodeChild);
              handleNodeAdded(curToNodeChild);
            }
          }
          curToNodeChild = toNextSibling;
          curFromNodeChild = fromNextSibling;
        }
      cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
      var specialElHandler = specialElHandlers[fromEl.nodeName];
      if (specialElHandler) {
        specialElHandler(fromEl, toEl);
      }
    }
    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;
    if (!childrenOnly) {
      if (morphedNodeType === ELEMENT_NODE) {
        if (toNodeType === ELEMENT_NODE) {
          if (!compareNodeNames(fromNode, toNode)) {
            onNodeDiscarded(fromNode);
            morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
          }
        } else {
          morphedNode = toNode;
        }
      } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
        if (toNodeType === morphedNodeType) {
          if (morphedNode.nodeValue !== toNode.nodeValue) {
            morphedNode.nodeValue = toNode.nodeValue;
          }
          return morphedNode;
        } else {
          morphedNode = toNode;
        }
      }
    }
    if (morphedNode === toNode) {
      onNodeDiscarded(fromNode);
    } else {
      if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
        return;
      }
      morphEl(morphedNode, toNode, childrenOnly);
      if (keyedRemovalList) {
        for (var i = 0, len = keyedRemovalList.length;i < len; i++) {
          var elToRemove = fromNodesLookup[keyedRemovalList[i]];
          if (elToRemove) {
            removeNode(elToRemove, elToRemove.parentNode, false);
          }
        }
      }
    }
    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
      if (morphedNode.actualize) {
        morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
      }
      fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }
    return morphedNode;
  };
};
var DOCUMENT_FRAGMENT_NODE = 11;
var range;
var NS_XHTML = "http://www.w3.org/1999/xhtml";
var doc = typeof document === "undefined" ? undefined : document;
var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
var specialElHandlers = {
  OPTION: function(fromEl, toEl) {
    var parentNode = fromEl.parentNode;
    if (parentNode) {
      var parentName = parentNode.nodeName.toUpperCase();
      if (parentName === "OPTGROUP") {
        parentNode = parentNode.parentNode;
        parentName = parentNode && parentNode.nodeName.toUpperCase();
      }
      if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
        if (fromEl.hasAttribute("selected") && !toEl.selected) {
          fromEl.setAttribute("selected", "selected");
          fromEl.removeAttribute("selected");
        }
        parentNode.selectedIndex = -1;
      }
    }
    syncBooleanAttrProp(fromEl, toEl, "selected");
  },
  INPUT: function(fromEl, toEl) {
    syncBooleanAttrProp(fromEl, toEl, "checked");
    syncBooleanAttrProp(fromEl, toEl, "disabled");
    if (fromEl.value !== toEl.value) {
      fromEl.value = toEl.value;
    }
    if (!toEl.hasAttribute("value")) {
      fromEl.removeAttribute("value");
    }
  },
  TEXTAREA: function(fromEl, toEl) {
    var newValue = toEl.value;
    if (fromEl.value !== newValue) {
      fromEl.value = newValue;
    }
    var firstChild = fromEl.firstChild;
    if (firstChild) {
      var oldValue = firstChild.nodeValue;
      if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
        return;
      }
      firstChild.nodeValue = newValue;
    }
  },
  SELECT: function(fromEl, toEl) {
    if (!toEl.hasAttribute("multiple")) {
      var selectedIndex = -1;
      var i = 0;
      var curChild = fromEl.firstChild;
      var optgroup;
      var nodeName;
      while (curChild) {
        nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
        if (nodeName === "OPTGROUP") {
          optgroup = curChild;
          curChild = optgroup.firstChild;
        } else {
          if (nodeName === "OPTION") {
            if (curChild.hasAttribute("selected")) {
              selectedIndex = i;
              break;
            }
            i++;
          }
          curChild = curChild.nextSibling;
          if (!curChild && optgroup) {
            curChild = optgroup.nextSibling;
            optgroup = null;
          }
        }
      }
      fromEl.selectedIndex = selectedIndex;
    }
  }
};
var ELEMENT_NODE = 1;
var DOCUMENT_FRAGMENT_NODE$1 = 11;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var morphdom = morphdomFactory(morphAttrs);
var morphdom_esm_default = morphdom;

// assets/otterly/otty.js
class Otty {
  constructor(isDev, afterDive, csrfSelector, csrfHeader) {
    this.isDev = isDev;
    this.previousDives = [];
    this.ActivePollId = null;
    this.afterDive = afterDive;
    this.poll_path = "/api/poll";
    this.csrfSelector = csrfSelector;
    this.csrfHeader = csrfHeader;
  }
  obj_to_fd = function(formInfo, formData) {
    if (formInfo instanceof FormData) {
      return formInfo;
    } else {
      let recursed = (formData2, key2, item) => {
        let key22, item2;
        if (Array.isArray(item)) {
          for (key22 in item) {
            item2 = item[key22];
            recursed(formData2, key2 + "[]", item2);
          }
        } else if (typeof item === "object") {
          for (key22 in item) {
            item2 = item[key22];
            recursed(formData2, key2 + "[" + key22 + "]", item2);
          }
        } else {
          formData2.append(key2, item);
        }
      };
      if (!formData) {
        formData = new FormData;
      }
      let key;
      for (key in formInfo) {
        let item = formInfo[key];
        recursed(formData, key, item);
      }
      return formData;
    }
  };
  _sendsXHROnLoad(resolve2, reject, xhr, responseType) {
    if (xhr.status >= 200 && xhr.status <= 302 && xhr.status != 300) {
      let rsp = xhr.response;
      if (responseType == "json") {
        try {
          rsp = JSON.parse(rsp);
        } catch {
        }
      }
      resolve2({ response: rsp, xhr });
    } else {
      reject({ status: xhr.status, statusText: xhr.statusText });
    }
  }
  _sendsXHROnError(resolve2, reject, xhr) {
    reject({
      status: xhr.status,
      statusText: xhr.statusText
    });
  }
  sendsXHR({
    url,
    formInfo,
    method = "POST",
    xhrChangeF,
    csrfContent,
    csrfHeader = this.csrfHeader,
    csrfSelector = this.csrfSelector,
    confirm,
    withCredentials = true,
    responseType = "json",
    onload = this._sendsXHROnLoad,
    onerror = this._sendsXHROnError
  }) {
    if (!csrfContent) {
      csrfContent = document.querySelector(csrfSelector).content;
    }
    return new Promise(function(resolve2, reject) {
      var xhr, form_data;
      xhr = new XMLHttpRequest;
      xhr.withCredentials = withCredentials;
      xhr.open(method, url);
      xhr.responseType = responseType;
      xhr.onload = onload.bind(this, resolve2, reject, xhr, responseType);
      xhr.onerror = onerror.bind(this, resolve2, reject, xhr);
      form_data = this.obj_to_fd(formInfo);
      xhr.setRequestHeader(csrfHeader, csrfContent);
      xhr.setRequestHeader("Otty", "true");
      if (xhrChangeF) {
        xhr = xhrChangeF(xhr);
      }
      if (confirm) {
        confirm = confirm(confirm);
        if (confirm) {
          xhr.send(form_data);
        } else {
          resolve2({ returning: "user rejected confirm prompt" });
        }
      } else {
        xhr.send(form_data);
      }
    }.bind(this));
  }
  isLocalUrl(url, subdomainAccuracy = -2) {
    let d = window.location.hostname;
    let urld = new URL(url, window.location).hostname;
    if (d.split(".").slice(subdomainAccuracy).join(".") == urld.split(".").slice(subdomainAccuracy).join(".")) {
      return true;
    }
    return false;
  }
  xss_pass(url) {
    return this.isLocalUrl(url, -2);
  }
  dive(opts = {}) {
    let url = opts.url;
    let baseElement = opts.baseElement;
    let submitter = opts.submitter;
    if (opts.e != null) {
      if (baseElement == null) {
        baseElement = opts.e.currentTarget;
      }
      if (submitter == null) {
        submitter = opts.e.submitter;
      }
    }
    if (!this.xss_pass(url)) {
      throw url + " is not a local_url";
    }
    let handle_response = ((actions, resolve2, reject) => {
      let y, ottys_capabilities, task, data, out, returning2, dive_id, action;
      returning2 = actions;
      if (!Array.isArray(actions)) {
        actions = [actions];
      }
      y = 0;
      ottys_capabilities = new this.afterDive(baseElement, submitter, resolve2, reject, this.isDev);
      for (action of actions) {
        if (!action) {
          continue;
        }
        dive_id = action.dive_id;
        if (dive_id) {
          if (this.previousDives.includes(dive_id)) {
            continue;
          }
          this.previousDives.push(dive_id);
          delete action.dive_id;
        }
        task = Object.keys(action)[0];
        data = action[task];
        if (task == "eval") {
          task = "eval2";
        }
        if (this.isDev) {
          console.log(task, data);
        }
        if (task == "returning") {
          returning2 = data;
        } else {
          try {
            out = ottys_capabilities[task](data);
          } catch (err) {
            if (this.isDev) {
              console.log(task, data, err, err.message);
            }
          }
          if (out == "break") {
            break;
          }
        }
      }
      resolve2(returning2);
    }).bind(this);
    return new Promise(function(resolve2, reject) {
      this.sendsXHR(opts).then((obj) => {
        handle_response(obj.response, resolve2, reject);
      }).catch((e) => {
        reject(e);
      });
    }.bind(this));
  }
  navigationHeadMorph(tempdocHead) {
    morphdom_esm_default(document.head, tempdocHead);
  }
  async stopGoto(href) {
    let loc = window.location;
    href = new URL(href, loc);
    if (loc.origin == href.origin && href.pathname == loc.pathname) {
      return await this.scrollToLocationHashElement(href);
    }
    if (loc.origin != href.origin) {
      window.location.href = href.origin;
      return true;
    }
    return false;
  }
  async linkClickedF(e) {
    let href = e.target.closest("[href]");
    if (!href) {
      return;
    }
    if (href.dataset.nativeHref) {
      return;
    }
    href = href.getAttribute("href");
    if (!this.isLocalUrl(href, -99)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    await this.goto(href);
    return;
  }
  async scrollToLocationHashElement(loc) {
    if (loc.hash) {
      let e = document.getElementById(decodeURIComponent(loc.hash.slice(1)));
      if (e) {
        await this.waitForImages();
        e.scrollIntoView();
        return true;
      }
    }
    return false;
  }
  poll = (dat) => {
    if (this.ActivePollId != dat.id) {
      return;
    }
    let maybe_resub = ((x) => {
      if (x == "should_resub") {
        this.subscribeToPoll(dat.queues, dat.poll_info, dat.wait_time);
      } else if (!(x == "no_updates")) {
        dat.store = x;
      }
    }).bind(this);
    let continue_polling = (() => {
      let poll = (() => {
        this.poll(dat);
      }).bind(this);
      setTimeout(poll, dat.wait_time);
    }).bind(this);
    this.dives(this.poll_path, {
      formInfo: {
        "otty-store": dat.store
      }
    }).then(maybe_resub).finally(continue_polling);
  };
  subscribeToPoll = (queues, poll_info, wait_time) => {
    let id = Math.random();
    this.ActivePollId = id;
    let dat = {
      queues,
      poll_info,
      wait_time,
      id
    };
    let poll = ((out) => {
      if (out == "no_queues") {
        if (this.isDev) {
          console.log("no_queues", out);
        }
      } else {
        dat.store = out;
        this.poll(dat);
      }
    }).bind(this);
    let err_log = ((x) => {
      if (this.isDev) {
        console.error("sub fail", x);
      }
    }).bind(this);
    this.dives("/api/pollsub", {
      formInfo: {
        queues: dat.queues,
        ...dat.poll_info
      }
    }).then(poll, err_log);
  };
  async goto(href, opts = {}) {
    if (await this.stopGoto(href)) {
      return -1;
    }
    opts = { reload: false, ...opts };
    let loc = window.location;
    href = new URL(href, loc);
    let prom = this.sendsXHR({
      url: href,
      method: "GET",
      responseType: "text",
      xhrChangeF: (xhr2) => {
        xhr2.setRequestHeader("Otty-Nav", "true");
        return xhr2;
      }
    });
    prom = await prom;
    let { response: page, xhr } = prom;
    if (xhr.responseURL) {
      let nhref = new URL(xhr.responseURL);
      nhref.hash = href.hash;
      href = nhref;
    }
    await this.pageReplace(page, 0, href, (BefBodyClone, befY, replaceSelector) => {
      this.replacePageState(loc, BefBodyClone, replaceSelector, befY);
      if (!opts.reload) {
        this.pushPageState(href, undefined, replaceSelector);
      }
    });
    return href;
  }
  createStorageDoc(orienter, head) {
    orienter = orienter.cloneNode(true);
    let storeDoc = new DOMParser().parseFromString("<!DOCTYPE HTML> <html></html>", "text/html");
    if (orienter.nodeName == "BODY") {
      storeDoc.body = orienter;
    } else {
      storeDoc.body.appendChild(orienter);
    }
    morphdom_esm_default(storeDoc.head, head);
    return storeDoc;
  }
  async pageReplace(tempdoc, scroll, url, beforeReplace) {
    let befY = window.scrollY;
    if (typeof tempdoc == "string") {
      tempdoc = new DOMParser().parseFromString(tempdoc, "text/html");
    }
    let tmpOrienter, orienter, replaceSelector;
    for (replaceSelector of this.navigationReplaces) {
      tmpOrienter = tempdoc.querySelector(replaceSelector);
      orienter = document.querySelector(replaceSelector);
      if (tmpOrienter && orienter) {
        break;
      }
    }
    for (let unitEl of this.qsInclusive(orienter, "[data-unit]")) {
      unitEl._unit?.unitRemoved();
    }
    let storeDoc = this.createStorageDoc(orienter, document.head);
    if (beforeReplace) {
      beforeReplace(storeDoc, befY, replaceSelector);
    }
    orienter.replaceWith(tmpOrienter);
    this.navigationHeadMorph(tempdoc.querySelector("head"));
    let shouldScrollToEl = url && !scroll;
    let scrolled = false;
    if (shouldScrollToEl) {
      scrolled = await this.scrollToLocationHashElement(url);
    }
    if (!scrolled) {
      if (scroll != 0) {
        await this.waitForImages();
      }
      window.scroll(0, scroll);
    }
  }
  async waitForImages() {
    let arr = Array.from(document.body.querySelectorAll("img")).map((im) => {
      new Promise((resolve2) => {
        im.addEventListener("load", resolve2);
        if (im.complete) {
          resolve2();
        }
      });
    });
    for (let a of arr) {
      await a;
    }
    return true;
  }
  _pageState(scroll, doc2, url, replaceSelector, match) {
    this.historyReferences[this.historyReferenceLocation] = {
      replaceSelector,
      doc: doc2,
      scroll,
      url,
      match
    };
  }
  replacePageState(url, doc2, replaceSelector, scroll) {
    let matcher = Math.random();
    window.history.replaceState({
      historyReferenceLocation: this.historyReferenceLocation,
      match: matcher
    }, "", url);
    this._pageState(scroll, doc2, url, replaceSelector, matcher);
  }
  pushPageState(url, doc2, replaceSelector) {
    let matcher = Math.random();
    this.historyReferenceLocation += 1;
    this.historyReferences = this.historyReferences.slice(0, this.historyReferenceLocation + 1);
    window.history.pushState({
      historyReferenceLocation: this.historyReferenceLocation,
      match: matcher
    }, "", url);
    this._pageState(0, doc2, url, replaceSelector, matcher);
  }
  qsInclusive(n, pat) {
    let units = Array.from(n.querySelectorAll(pat));
    if (n.matches(pat)) {
      units.push(n);
    }
    return units;
  }
  handleNavigation(opts = {}) {
    opts = { navigationReplaces: ["body"], ...opts };
    this.navigationReplaces = opts.navigationReplaces;
    console.log("NR", this.navigationReplaces);
    this.historyReferenceLocation = 0;
    this.historyReferences = [];
    history.scrollRestoration = "manual";
    document.addEventListener("click", this.linkClickedF.bind(this));
    window.addEventListener("popstate", async function(e) {
      if (e.state && e.state.historyReferenceLocation != null) {
        let lastInf = this.historyReferences[this.historyReferenceLocation];
        let lastScroll = window.scrollY;
        this.historyReferenceLocation = e.state.historyReferenceLocation;
        let hr = this.historyReferences[this.historyReferenceLocation];
        if (hr && hr.match == e.state.match) {
          await this.pageReplace(hr.doc, hr.scroll, hr.url, (befBodyClone, befY, replaceSelector) => {
            lastInf.scroll = befY;
            lastInf.doc = befBodyClone;
            lastInf.replaceSelector = replaceSelector;
          });
        } else {
          this.historyReferenceLocation = 0;
          this.historyReferences = [];
          this.goto(window.location, { reload: true });
        }
      }
    }.bind(this));
    this.scrollToLocationHashElement(window.location);
  }
}

// assets/otterly/after_dive.js
class AfterDive {
  constructor(baseElement, submitter, resolve2, reject, isDev) {
    this.baseElement = baseElement;
    this.submitter = submitter;
    this.resolve = resolve2;
    this.reject = reject;
    this.isDev = isDev;
  }
  getThing(obj, optional = false, doc2 = document) {
    let el;
    if (obj.id) {
      el = doc2.getElementById(obj.id);
      if (!el && !optional && this.isDev) {
        console.log("could not find object with id: ", obj.id);
      }
    } else if (obj.selector) {
      el = this.getSelector(obj.selector, doc2);
      if (!el && !optional && this.isDev) {
        console.log("could not find object with selector: ", obj.selector);
      }
    } else if (!optional && this.isDev) {
      console.log('expected a node identifier (either a "selector" field or an "id" field)');
    }
    return el;
  }
  getSelector(str, doc2 = document) {
    if (str == "submitter") {
      return this.submitter;
    } else if (str == "baseElement") {
      return this.baseElement;
    } else {
      return doc2.querySelector(str);
    }
  }
  log(obj) {
    console.log(obj);
  }
  reload() {
    Turbo.cache.clear();
    otty.goto(window.location.href, { reload: true });
  }
  redirect(obj) {
    otty.goto(obj);
  }
  insert(obj) {
    let sel = this.getThing(obj);
    if (!sel) {
      return;
    }
    let pos = obj["position"];
    let html = obj["html"];
    sel.insertAdjacentHTML(pos, html);
  }
  morph(x) {
    let opts = x;
    let perm = x["permanent"];
    let ign = x["ignore"];
    if (opts == null) {
      opts = {};
    }
    if (ign != null || perm != null) {
      let m_parse_p = (selector, from, to) => {
        if (from.matches(selector) && to.matches(selector)) {
          return false;
        } else {
          return true;
        }
      };
      let m_parse_i = (selector, from, to) => {
        if (from.matches(selector) || to.matches(selector)) {
          return false;
        } else {
          return true;
        }
      };
      let m_parse = (selectors, inner_parse, from, to) => {
        if (!Array.isArray(selectors)) {
          selectors = [selectors];
        }
        for (let y = 0;y < selectors.length; y++) {
          if (!inner_parse(selectors[y], from, to)) {
            return false;
          }
        }
        return true;
      };
      opts["onBeforeElChildrenUpdated"] = (from, to) => {
        if (!m_parse(ign, m_parse_i, from, to)) {
          return false;
        }
        if (!m_parse(perm, m_parse_p, from, to)) {
          return false;
        }
        return true;
      };
    }
    let s = this.getThing(x);
    if (!s) {
      return;
    }
    morphdom_esm_default(s, x["html"], opts);
  }
  remove(obj) {
    let s = this.getThing(obj);
    if (!s) {
      return;
    }
    s.parentNode.removeChild(s);
  }
  replace(obj) {
    let sel, parser, tempdoc, orienter, childrenOnly;
    parser = new DOMParser;
    tempdoc = parser.parseFromString(obj["html"], "text/html");
    orienter = this.getThing(obj, false, tempdoc);
    if (!orienter) {
      return;
    }
    childrenOnly = obj["childrenOnly"];
    sel = this.getThing(obj);
    if (!sel) {
      return;
    }
    if (orienter == null) {
      if (childrenOnly) {
        sel.innerHTML = obj["html"];
      } else {
        orienter = tempdoc.querySelector("body").children[0];
        sel.replaceWith(orienter);
      }
    } else {
      if (childrenOnly) {
        sel.innerHTML = orienter.innerHTML;
      } else {
        sel.replaceWith(orienter);
      }
    }
  }
  innerHtml(obj) {
    let s = this.getThing(obj);
    if (!s) {
      return;
    }
    s.innerHTML = obj["html"];
  }
  eval2(data) {
    let selector = getThing(data, true);
    let x = Function("data", "selector", "baseElement", "submitter", `"use strict"; ${data["code"]};`)(data, selector, this.baseElement, this.submitter);
    if (x == "break") {
      resolve(returning);
      return "break";
    }
  }
  setData(data) {
    let keys, x, key, obj, attrs, attr_keys, y, attr_key;
    keys = Object.keys(data);
    for (x = 0;x < keys.length; x++) {
      key = keys[x];
      obj = this.getSelector(key);
      attrs = data[key];
      attr_keys = Object.keys(attrs);
      for (y = 0;y < attr_keys.length; y++) {
        attr_key = attr_keys[y];
        obj.dataset[attr_key] = attrs[attr_key];
      }
    }
  }
}

// assets/otterly/units/generic.js
var generic = {
  unitName: "Generic",
  unitRemoved() {
    this.el._unit = undefined;
  },
  unitConnected() {
  },
  unitEvents: [],
  addUnitEvent(evInfo, actionNode) {
    let action = evInfo.action;
    let f_name = evInfo.f_name;
    let input = evInfo.input;
    let f = this[f_name];
    if (!f) {
      console.error(`Could not find function ${f} on unit: `, this, "data-on defined on: ", actionNode);
      return;
    }
    let f3;
    if (input.length > 0) {
      let f2 = (input2, event) => f.bind(this)(event, ...input2);
      f3 = f2.bind(this, input);
    } else {
      f3 = f.bind(this);
    }
    let f_str = JSON.stringify(evInfo);
    console.log(action, action, action, action);
    if (action == "_remove") {
      this.unitEvents.push({ actionNode, action, f: f3, f_str, f_name });
    } else if (action == "_parse") {
      console.log("HERE", action, f3);
      actionNode.addEventListener(action, f3);
      actionNode.dispatchEvent(new Event(action));
      actionNode.removeEventListener(action, f3);
    } else {
      actionNode.addEventListener(action, f3);
      this.unitEvents.push({ actionNode, action, f: f3, f_str, f_name });
    }
  },
  removeUnitEvent(evInfo, actionNode) {
    let f_str = JSON.stringify(evInfo);
    let comp = (ue) => actionNode == ue.actionNode && ue.f_str == f_str;
    let e = this.unitEvents.find(comp);
    if (e == undefined) {
      return e;
    }
    e = this.unitEvents.splice(this.unitEvents.indexOf(e), 1)[0];
    if (e.action == "_remove") {
      e.actionNode.addEventListener(e.action, e.f);
      e.actionNode.dispatchEvent(new Event(e.action));
      e.actionNode.removeEventListener(e.action, e.f);
    } else {
      e.actionNode.removeEventListener(e.action, e.f);
    }
    return e;
  },
  parentUnit(unitc) {
    let p = this.el.parentElement;
    if (unitc == undefined) {
      while (p != null && !(p.dataset.unit == undefined)) {
        p = p.parentElement;
      }
    } else {
      while (p != null && !p.dataset.unit.split(" ").includes(unitc)) {
        p = p.parentElement;
      }
    }
    if (p == undefined) {
      return p;
    }
    return p._unit;
  },
  childUnitsFirstLayer(unitc) {
    let arr;
    if (unitc == undefined) {
      arr = this.el.qa(":scope [data-unit]:not(:scope [data-unit] [data-unit])");
    } else {
      arr = this.el.qa(":scope [data-unit] [data-unit='" + unitc + "']:not(:scope [data-unit] [data-unit~='" + unitc + "'])");
    }
    return Array.from(arr).map((el) => el._unit);
  },
  childUnitsDirect(unitc) {
    let arr;
    if (unitc == undefined) {
      arr = this.qa(":scope > [data-unit]");
    } else {
      arr = this.qa(":scope > [data-unit~='" + unitc + "']");
    }
    return Array.from(arr).map((el) => el._unit);
  },
  childUnits(unitc) {
    let arr;
    if (unitc == undefined) {
      arr = this.qa(":scope [data-unit]");
    } else {
      arr = this.qa(":scope [data-unit~='" + unitc + "']");
    }
    return Array.from(arr).map((el) => el._unit);
  },
  diveOptParams: [
    "url",
    "method",
    "csrfContent",
    "csrfHeader",
    "csrfSelector",
    "confirm",
    "withCredentials",
    "e",
    "submitter"
  ],
  diveErrParams: ["formInfo", "xhrChangeF", "baseElement"],
  relevantData(e) {
    if (e) {
      let unitId = this.el.id;
      let submitterId = e.ct.id;
      let d1 = this.el.dataset;
      let d2 = e.ct.dataset;
      let out = { unitId, submitterId, ...d1, ...d2 };
      return out;
    } else {
      return { unitId: this.el.id, ...this.el.dataset };
    }
  },
  diveRepeatDefaultStopF(h) {
    let pageChanged = window.location.href != h.originalPageLocation;
    let askedToStop = h.lastResult == "STOP";
    return pageChanged || askedToStop;
  },
  diveBehaviors: {
    repeat: async function(e, h) {
      h.originalPageLocation = window.location.href;
      if (!h.stopF) {
        h.stopF = this.diveRepeatDefaultStopF.bind(this);
      } else {
        h.stopF = this[h.stopF].bind(this);
      }
      if (h.processF) {
        h.processF = this[h.processF].bind(this);
      }
      h.repeats = 0;
      if (!h.waitTime) {
        h.waitTime = 3000;
      }
      let inf = this.diveInfo(e, h);
      while (!h.stopF(h)) {
        h.lastResult = otty.dive(inf);
        if (h.processF) {
          h.processF(h);
        }
        h.repeats += 1;
        let justWait = (resolver) => setTimeout(resolver, h.waitTime);
        await new Promise(justWait, justWait);
      }
    },
    default: function(e, h) {
      return otty.dive(this.diveInfo(e, h));
    }
  },
  diveInfo(e, h = {}) {
    let defaults = {
      opts: { e, formInfo: {} },
      data: { ...this.relevantData(e) },
      formData: new FormData,
      withform: false
    };
    h = { ...defaults, ...h };
    h.opts = { ...defaults.opts, ...h.opts };
    let inp, els, k;
    for (k of Object.keys(h.data)) {
      if (this.diveOptParams.includes(k)) {
        h.opts[k] = h.data[k];
      } else if (this.diveErrParams.includes(k)) {
        console.error("bad key for diveDataset: " + k);
      } else {
        h.opts.formInfo[k] = h.data[k];
      }
    }
    if (h.withform) {
      els = Array.from(this.el.qsa("input"));
      if (this.el.nodeName == "INPUT") {
        els.push(this.el);
      }
      for (inp of els) {
        if (inp.name != null && inp.value != null) {
          h.formData.append(inp.name, inp.value);
        }
      }
    }
    if (!h.opts.url) {
      h.opts.url = h.opts.formInfo.path;
    }
    if (h.withform) {
      if (!h.opts.url) {
        h.opts.url = e.ct.getAttribute("formaction");
      }
      if (!h.opts.url) {
        h.opts.url = e.ct.closest("form")?.getAttribute("action");
      }
    }
    if (!h.opts.method) {
      h.opts.method = h.opts.formInfo.method;
    }
    if (h.withform) {
      if (!h.opts.method) {
        h.opts.method = e.ct.getAttribute("formmethod");
      }
      if (!h.opts.method) {
        h.opts.method = e.ct.closest("form")?.getAttribute("method");
      }
    }
    if (!h.opts.method) {
      h.opts.method = "POST";
    }
    console.log(h.opts.formInfo, h.formData);
    h.opts.formInfo = otty.obj_to_fd(h.opts.formInfo, h.formData);
    return h.opts;
  },
  dive(e, h) {
    e.preventDefault();
    let act;
    if (h.behavior == undefined) {
      h.behavior = "default";
    }
    if (act = this.diveBehaviors[h.behavior]) {
      return act.bind(this)(e, h);
    } else {
      console.error("bad behavior type for a dive");
    }
  }
};
Object.defineProperties(generic, {
  el: {
    get: function() {
      return this.element;
    },
    set: function(v) {
      return this.element = v;
    }
  }
});
var generic_default = generic;

// assets/otterly/unit_handler.js
class UnitHandler {
  constructor(generic2, unit_list) {
    this.generic = generic2;
    this.units = unit_list;
    this.shortcuts();
    this.handleFirstUnits();
    this.createObserver();
    return this;
  }
  shortcuts() {
    Object.defineProperties(Event.prototype, {
      ct: {
        get: function() {
          return this.currentTarget;
        }
      }
    });
    Object.defineProperties(HTMLElement.prototype, {
      ds: {
        get: function() {
          return this.dataset;
        },
        set: function(v) {
          return this.dataset = v;
        }
      }
    });
    HTMLElement.prototype.qs = HTMLElement.prototype.querySelector;
    HTMLElement.prototype.qsa = HTMLElement.prototype.querySelectorAll;
    document.qs = document.querySelector;
    document.qsa = document.querySelectorAll;
  }
  addUnit(ob, nms) {
    if (nms == undefined) {
      nms = ob.dataset.unit.split(" ");
    }
    let onConnected = [];
    let onRemoved = [];
    let u;
    if (ob._unit == undefined) {
      ob._unit = { ...this.generic };
      u = ob._unit;
      Object.defineProperties(u, {
        el: {
          get: function() {
            return this.element;
          },
          set: function(v) {
            return this.element = v;
          }
        }
      });
    } else {
      u = ob._unit;
    }
    let cs = [u];
    for (let nm of nms) {
      let c = this.units[nm];
      if (c == undefined) {
        console.error("data-unit\'s \'" + nm + "\' is not matching any unit names.");
      } else if (!(c == this.generic)) {
        cs.push(c);
      }
    }
    for (let u2 of cs) {
      if (u2.onConnected) {
        onConnected.push(u2.onConnected);
      }
      if (u2.onRemoved) {
        onRemoved.push(u2.onRemoved);
      }
    }
    Object.assign(...cs);
    u.el = ob;
    if (onConnected.length > 0) {
      u.unitConnected = function(oc, uc) {
        uc.bind(this)();
        for (let f of oc) {
          f.bind(this)();
        }
      }.bind(u, onConnected, u.unitConnected);
    }
    if (onRemoved.length > 0) {
      u.unitRemoved = function(or, ur) {
        for (let f of or) {
          f.bind(this)();
        }
        ur.bind(this)();
      }.bind(u, onRemoved, u.unitRemoved);
    }
    return ob;
  }
  parseEventString(x) {
    if (!x || x.length == 0) {
      return [];
    }
    if (x[x.length - 1] != ";") {
      x += ";";
    }
    let all = [];
    let current = {};
    let i = 0;
    while (i < x.length) {
      if (x.substr(i, 2) == "->") {
        current.action = x.substr(0, i);
        x = x.substr(i + 2);
        i = 0;
      } else if (x[i] == "#") {
        current.unit = x.substr(0, i);
        x = x.substr(i + 1);
        i = 0;
      } else if (x[i] == "[") {
        current.f_name = x.substr(0, i);
        x = x.substr(i);
        i = 0;
        let json = undefined;
        let end;
        for (end = 0;end < x.length; end += 1) {
          if (x.substr(end, 2) == "];") {
            try {
              json = JSON.parse(x.substr(i, end - i + 1));
            } catch {
              console.log("failed to parse json");
              json = undefined;
              continue;
            }
            break;
          }
        }
        if (json == undefined) {
          console.error("parse issue in data-on, json expected");
        }
        current.input = json;
        x = x.substr(end + 1);
        i = 0;
      } else if (x[i] == ";") {
        if (!current.f_name && i != 0) {
          current.f_name = x.substr(0, i);
        }
        x = x.substr(i + 1);
        i = 0;
        if (current.f_name && current.action) {
          all.push(current);
        }
        current = {};
      } else {
        i += 1;
      }
    }
    all.map((current2) => {
      if (current2.action == undefined) {
        current2.action = "connect";
      }
      if (current2.input == undefined) {
        current2.input = [];
      }
      if (current2.f_name == undefined || current2.f_name == "") {
        throw new Error("parse issue in data-on, no function name found");
      }
      return JSON.stringify(current2);
    });
    return all;
  }
  handleFirstUnits() {
    let node, x, unit;
    x = {};
    for (let u of this.units) {
      x[u.unitName] = u;
    }
    this.units = x;
    let load_units = Array.from(document.querySelectorAll("[data-unit]"));
    for (node of load_units) {
      this.addUnit(node);
    }
    let load_xs = Array.from(document.querySelectorAll("[data-on]"));
    for (node of load_xs) {
      let evs = this.parseEventString(node.dataset.on);
      for (let ev of evs) {
        unit = this.getEventUnit(ev, node);
        if (!unit) {
          continue;
        }
        unit.addUnitEvent(ev, node);
      }
    }
    for (node of load_units) {
      node._unit.unitConnected();
    }
  }
  qsInclusive(n, pat) {
    let units = Array.from(n.querySelectorAll(pat));
    if (n.matches(pat)) {
      units.push(n);
    }
    return units;
  }
  getEventUnit(x, xNode, brokenParent) {
    let getUnit = (from, x2) => {
      if (x2.unit) {
        return from.closest(`[data-unit~=\'${x2.unit}\']`);
      } else {
        return from.closest("[data-unit]");
      }
    };
    let unit = getUnit(xNode, x);
    if (brokenParent && !unit) {
      unit = getUnit(brokenParent, x);
    }
    if (!unit || !unit._unit) {
      if (otty.isDev) {
        console.log("unit not found for following node:", xNode, "event parse data: ", x);
      }
      return null;
    }
    return unit._unit;
  }
  changeEvents(node, new_x, old_x, brokenParent) {
    let unit, x, nx, ox;
    new_x = this.parseEventString(new_x);
    old_x = this.parseEventString(old_x);
    nx = new_x.filter((x2) => !old_x.includes(x2));
    ox = old_x.filter((x2) => !new_x.includes(x2));
    for (x of ox) {
      unit = this.getEventUnit(x, node, brokenParent);
      if (!unit) {
        continue;
      }
      unit.removeUnitEvent(x, node);
    }
    for (x of nx) {
      unit = this.getEventUnit(x, node, brokenParent);
      if (!unit) {
        continue;
      }
      unit.addUnitEvent(x, node);
    }
  }
  createObserver() {
    this.observer = new MutationObserver((ma) => {
      let n, ns, chls, mut, attrs;
      ns = [];
      ma = Array.from(ma);
      chls = ma.filter((m) => {
        return m.type == "childList";
      });
      for (mut of chls) {
        for (n of mut.removedNodes) {
          let brokenParent = mut.target;
          if (!n.querySelector) {
            continue;
          }
          let evNodes = this.qsInclusive(n, "[data-on]");
          for (let evNode of evNodes) {
            this.changeEvents(evNode, "", evNode.dataset.on, brokenParent);
          }
          let units = this.qsInclusive(n, "[data-unit]");
          for (let u of units) {
            u._unit?.unitRemoved();
          }
        }
        for (n of mut.addedNodes) {
          if (!n.querySelector) {
            continue;
          }
          let units = this.qsInclusive(n, "[data-unit]");
          for (let u of units) {
            ns.push(this.addUnit(u));
          }
          let evNodes = this.qsInclusive(n, "[data-on]");
          for (let evNode of evNodes) {
            this.changeEvents(evNode, evNode.dataset.on, "");
          }
        }
      }
      attrs = ma.filter((m) => {
        return m.type == "attributes" && (m.attributeName == "data-unit" || m.attributeName == "data-on");
      });
      let dus, xs, target, oldValue, it;
      let mattrs = new Map([
        ["data-unit", dus = new Map],
        ["data-on", xs = new Map]
      ]);
      for (mut of attrs) {
        if (!mattrs.get(mut.attributeName).get(mut.target)) {
          mattrs.get(mut.attributeName).set(mut.target, mut.oldValue);
        }
      }
      it = dus.keys();
      while (!(target = it.next()).done) {
        target = target.value;
        oldValue = dus.get(target);
        if (!target.dataset.unit) {
          target._unit?.unitRemoved();
        } else {
          if (!oldValue) {
            oldValue = "";
          }
          let ol = oldValue.split(" ");
          let added = target.dataset.unit.split(" ").filter((z) => {
            return !ol.includes(z);
          });
          if (added.length > 0) {
            this.addUnit(target, added);
            if (!oldValue) {
              ns.push(mut.target);
            }
          }
        }
      }
      it = xs.keys();
      while (!(target = it.next()).done) {
        target = target.value;
        oldValue = xs.get(target);
        this.changeEvents(target, target.dataset.on, oldValue);
      }
      for (n of ns) {
        n._unit.unitConnected();
      }
    });
    this.observer.observe(document.documentElement, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ["data-on", "data-unit"],
      attributeOldValue: true
    });
    return this.observer;
  }
}

// assets/otterly/units/debug.js
var debug_default = {
  unitName: "Debug",
  unitRemoved() {
    console.log("unitRemoved");
  },
  unitConnected() {
    console.log("unitConnected");
  },
  addUnitEvent(...args) {
    generic_default.addUnitEvent(...args);
    console.log("ran addUnitEvent. unitEvents:", this.unitEvents, "args:", ...args);
  },
  removeUnitEvent(...args) {
    generic_default.removeUnitEvent(...args);
    console.log("ran removeUnitEvent. unitEvents:", this.unitEvents, "args:", ...args);
  },
  log(...args) {
    console.log(this, ...args);
  }
};

// assets/js/units/Syntax.js
var Syntax_default = {
  unitName: "Syntax",
  onConnected: function() {
    let lang = this.el.ds.language;
    let txt = this.el.innerText;
    let out = otty.highlighter.highlight(txt, { language: lang });
    this.el.innerHTML = out.value;
  }
};

// assets/js/units/more_otters.js
var more_otters_default = {
  unitName: "MoreOtters",
  otterCount: 0,
  makeOtter: function() {
    this.el.insertAdjacentText("afterbegin", "\uD83E\uDDA6");
    this.otterCount += 1;
  }
};

// node_modules/highlight.js/es/core.js
var core = __toESM(require_core(), 1);
var core_default = core.default;

// node_modules/highlight.js/es/languages/javascript.js
var javascript = function(hljs) {
  const regex = hljs.regex;
  const hasClosingTag = (match, { after }) => {
    const tag = "</" + match[0].slice(1);
    const pos = match.input.indexOf(tag, after);
    return pos !== -1;
  };
  const IDENT_RE$1 = IDENT_RE;
  const FRAGMENT = {
    begin: "<>",
    end: "</>"
  };
  const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
  const XML_TAG = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    isTrulyOpeningTag: (match, response) => {
      const afterMatchIndex = match[0].length + match.index;
      const nextChar = match.input[afterMatchIndex];
      if (nextChar === "<" || nextChar === ",") {
        response.ignoreMatch();
        return;
      }
      if (nextChar === ">") {
        if (!hasClosingTag(match, { after: afterMatchIndex })) {
          response.ignoreMatch();
        }
      }
      let m;
      const afterMatch = match.input.substring(afterMatchIndex);
      if (m = afterMatch.match(/^\s*=/)) {
        response.ignoreMatch();
        return;
      }
      if (m = afterMatch.match(/^\s+extends\s+/)) {
        if (m.index === 0) {
          response.ignoreMatch();
          return;
        }
      }
    }
  };
  const KEYWORDS$1 = {
    $pattern: IDENT_RE,
    keyword: KEYWORDS,
    literal: LITERALS,
    built_in: BUILT_INS,
    "variable.language": BUILT_IN_VARIABLES
  };
  const decimalDigits = "[0-9](_?[0-9])*";
  const frac = `\\.(${decimalDigits})`;
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const NUMBER = {
    className: "number",
    variants: [
      { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))` + `[eE][+-]?(${decimalDigits})\\b` },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
      { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  };
  const SUBST = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: KEYWORDS$1,
    contains: []
  };
  const HTML_TEMPLATE = {
    begin: "html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "xml"
    }
  };
  const CSS_TEMPLATE = {
    begin: "css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "css"
    }
  };
  const GRAPHQL_TEMPLATE = {
    begin: "gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "graphql"
    }
  };
  const TEMPLATE_STRING = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  const JSDOC_COMMENT = hljs.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
    relevance: 0,
    contains: [
      {
        begin: "(?=@[A-Za-z]+)",
        relevance: 0,
        contains: [
          {
            className: "doctag",
            begin: "@[A-Za-z]+"
          },
          {
            className: "type",
            begin: "\\{",
            end: "\\}",
            excludeEnd: true,
            excludeBegin: true,
            relevance: 0
          },
          {
            className: "variable",
            begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
            endsParent: true,
            relevance: 0
          },
          {
            begin: /(?=[^\n])\s/,
            relevance: 0
          }
        ]
      }
    ]
  });
  const COMMENT = {
    className: "comment",
    variants: [
      JSDOC_COMMENT,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]
  };
  const SUBST_INTERNALS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    GRAPHQL_TEMPLATE,
    TEMPLATE_STRING,
    { match: /\$\d+/ },
    NUMBER
  ];
  SUBST.contains = SUBST_INTERNALS.concat({
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS$1,
    contains: [
      "self"
    ].concat(SUBST_INTERNALS)
  });
  const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
  const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
    {
      begin: /\(/,
      end: /\)/,
      keywords: KEYWORDS$1,
      contains: ["self"].concat(SUBST_AND_COMMENTS)
    }
  ]);
  const PARAMS = {
    className: "params",
    begin: /\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS$1,
    contains: PARAMS_CONTAINS
  };
  const CLASS_OR_EXTENDS = {
    variants: [
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1,
          /\s+/,
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  };
  const CLASS_REFERENCE = {
    relevance: 0,
    match: regex.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
    className: "title.class",
    keywords: {
      _: [
        ...TYPES,
        ...ERROR_TYPES
      ]
    }
  };
  const USE_STRICT = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  };
  const FUNCTION_DEFINITION = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          IDENT_RE$1,
          /(?=\s*\()/
        ]
      },
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [PARAMS],
    illegal: /%/
  };
  const UPPER_CASE_CONSTANT = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function noneOf(list) {
    return regex.concat("(?!", list.join("|"), ")");
  }
  const FUNCTION_CALL = {
    match: regex.concat(/\b/, noneOf([
      ...BUILT_IN_GLOBALS,
      "super",
      "import"
    ]), IDENT_RE$1, regex.lookahead(/\(/)),
    className: "title.function",
    relevance: 0
  };
  const PROPERTY_ACCESS = {
    begin: regex.concat(/\./, regex.lookahead(regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/))),
    end: IDENT_RE$1,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  };
  const GETTER_OR_SETTER = {
    match: [
      /get|set/,
      /\s+/,
      IDENT_RE$1,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        begin: /\(\)/
      },
      PARAMS
    ]
  };
  const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
  const FUNCTION_VARIABLE = {
    match: [
      /const|var|let/,
      /\s+/,
      IDENT_RE$1,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      regex.lookahead(FUNC_LEAD_IN_RE)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      PARAMS
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: KEYWORDS$1,
    exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
    illegal: /#(?![$_A-z])/,
    contains: [
      hljs.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      USE_STRICT,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      COMMENT,
      { match: /\$\d+/ },
      NUMBER,
      CLASS_REFERENCE,
      {
        className: "attr",
        begin: IDENT_RE$1 + regex.lookahead(":"),
        relevance: 0
      },
      FUNCTION_VARIABLE,
      {
        begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          COMMENT,
          hljs.REGEXP_MODE,
          {
            className: "function",
            begin: FUNC_LEAD_IN_RE,
            returnBegin: true,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: hljs.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: KEYWORDS$1,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          {
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            variants: [
              { begin: FRAGMENT.begin, end: FRAGMENT.end },
              { match: XML_SELF_CLOSING },
              {
                begin: XML_TAG.begin,
                "on:begin": XML_TAG.isTrulyOpeningTag,
                end: XML_TAG.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: XML_TAG.begin,
                end: XML_TAG.end,
                skip: true,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      FUNCTION_DEFINITION,
      {
        beginKeywords: "while if switch catch for"
      },
      {
        begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        returnBegin: true,
        label: "func.def",
        contains: [
          PARAMS,
          hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
        ]
      },
      {
        match: /\.\.\./,
        relevance: 0
      },
      PROPERTY_ACCESS,
      {
        match: "\\$" + IDENT_RE$1,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [PARAMS]
      },
      FUNCTION_CALL,
      UPPER_CASE_CONSTANT,
      CLASS_OR_EXTENDS,
      GETTER_OR_SETTER,
      {
        match: /\$[(.]/
      }
    ]
  };
};
var IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
var KEYWORDS = [
  "as",
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends"
];
var LITERALS = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
];
var TYPES = [
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  "Math",
  "Date",
  "Number",
  "BigInt",
  "String",
  "RegExp",
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  "Reflect",
  "Proxy",
  "Intl",
  "WebAssembly"
];
var ERROR_TYPES = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
];
var BUILT_IN_GLOBALS = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
];
var BUILT_IN_VARIABLES = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "global"
];
var BUILT_INS = [].concat(BUILT_IN_GLOBALS, TYPES, ERROR_TYPES);

// node_modules/highlight.js/es/languages/xml.js
var xml = function(hljs) {
  const regex = hljs.regex;
  const TAG_NAME_RE = regex.concat(/[\p{L}_]/u, regex.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u);
  const XML_IDENT_RE = /[\p{L}0-9._:-]+/u;
  const XML_ENTITIES = {
    className: "symbol",
    begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
  };
  const XML_META_KEYWORDS = {
    begin: /\s/,
    contains: [
      {
        className: "keyword",
        begin: /#?[a-z_][a-z1-9_-]+/,
        illegal: /\n/
      }
    ]
  };
  const XML_META_PAR_KEYWORDS = hljs.inherit(XML_META_KEYWORDS, {
    begin: /\(/,
    end: /\)/
  });
  const APOS_META_STRING_MODE = hljs.inherit(hljs.APOS_STRING_MODE, { className: "string" });
  const QUOTE_META_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, { className: "string" });
  const TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: "attr",
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: "string",
            endsParent: true,
            variants: [
              {
                begin: /"/,
                end: /"/,
                contains: [XML_ENTITIES]
              },
              {
                begin: /'/,
                end: /'/,
                contains: [XML_ENTITIES]
              },
              { begin: /[^\s"'=<>`]+/ }
            ]
          }
        ]
      }
    ]
  };
  return {
    name: "HTML, XML",
    aliases: [
      "html",
      "xhtml",
      "rss",
      "atom",
      "xjb",
      "xsd",
      "xsl",
      "plist",
      "wsf",
      "svg"
    ],
    case_insensitive: true,
    unicodeRegex: true,
    contains: [
      {
        className: "meta",
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [
          XML_META_KEYWORDS,
          QUOTE_META_STRING_MODE,
          APOS_META_STRING_MODE,
          XML_META_PAR_KEYWORDS,
          {
            begin: /\[/,
            end: /\]/,
            contains: [
              {
                className: "meta",
                begin: /<![a-z]/,
                end: />/,
                contains: [
                  XML_META_KEYWORDS,
                  XML_META_PAR_KEYWORDS,
                  QUOTE_META_STRING_MODE,
                  APOS_META_STRING_MODE
                ]
              }
            ]
          }
        ]
      },
      hljs.COMMENT(/<!--/, /-->/, { relevance: 10 }),
      {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      },
      XML_ENTITIES,
      {
        className: "meta",
        end: /\?>/,
        variants: [
          {
            begin: /<\?xml/,
            relevance: 10,
            contains: [
              QUOTE_META_STRING_MODE
            ]
          },
          {
            begin: /<\?[a-z][a-z0-9]+/
          }
        ]
      },
      {
        className: "tag",
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: "style" },
        contains: [TAG_INTERNALS],
        starts: {
          end: /<\/style>/,
          returnEnd: true,
          subLanguage: [
            "css",
            "xml"
          ]
        }
      },
      {
        className: "tag",
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: "script" },
        contains: [TAG_INTERNALS],
        starts: {
          end: /<\/script>/,
          returnEnd: true,
          subLanguage: [
            "javascript",
            "handlebars",
            "xml"
          ]
        }
      },
      {
        className: "tag",
        begin: /<>|<\/>/
      },
      {
        className: "tag",
        begin: regex.concat(/</, regex.lookahead(regex.concat(TAG_NAME_RE, regex.either(/\/>/, />/, /\s/)))),
        end: /\/?>/,
        contains: [
          {
            className: "name",
            begin: TAG_NAME_RE,
            relevance: 0,
            starts: TAG_INTERNALS
          }
        ]
      },
      {
        className: "tag",
        begin: regex.concat(/<\//, regex.lookahead(regex.concat(TAG_NAME_RE, />/))),
        contains: [
          {
            className: "name",
            begin: TAG_NAME_RE,
            relevance: 0
          },
          {
            begin: />/,
            relevance: 0,
            endsParent: true
          }
        ]
      }
    ]
  };
};

// node_modules/highlight.js/es/languages/elixir.js
var elixir = function(hljs) {
  const regex = hljs.regex;
  const ELIXIR_IDENT_RE = "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?";
  const ELIXIR_METHOD_RE = "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?";
  const KEYWORDS2 = [
    "after",
    "alias",
    "and",
    "case",
    "catch",
    "cond",
    "defstruct",
    "defguard",
    "do",
    "else",
    "end",
    "fn",
    "for",
    "if",
    "import",
    "in",
    "not",
    "or",
    "quote",
    "raise",
    "receive",
    "require",
    "reraise",
    "rescue",
    "try",
    "unless",
    "unquote",
    "unquote_splicing",
    "use",
    "when",
    "with|0"
  ];
  const LITERALS2 = [
    "false",
    "nil",
    "true"
  ];
  const KWS = {
    $pattern: ELIXIR_IDENT_RE,
    keyword: KEYWORDS2,
    literal: LITERALS2
  };
  const SUBST = {
    className: "subst",
    begin: /#\{/,
    end: /\}/,
    keywords: KWS
  };
  const NUMBER = {
    className: "number",
    begin: "(\\b0o[0-7_]+)|(\\b0b[01_]+)|(\\b0x[0-9a-fA-F_]+)|(-?\\b[0-9][0-9_]*(\\.[0-9_]+([eE][-+]?[0-9]+)?)?)",
    relevance: 0
  };
  const ESCAPES_RE = /\\[\s\S]/;
  const BACKSLASH_ESCAPE = {
    match: ESCAPES_RE,
    scope: "char.escape",
    relevance: 0
  };
  const SIGIL_DELIMITERS = '[/|([{<"\']';
  const SIGIL_DELIMITER_MODES = [
    {
      begin: /"/,
      end: /"/
    },
    {
      begin: /'/,
      end: /'/
    },
    {
      begin: /\//,
      end: /\//
    },
    {
      begin: /\|/,
      end: /\|/
    },
    {
      begin: /\(/,
      end: /\)/
    },
    {
      begin: /\[/,
      end: /\]/
    },
    {
      begin: /\{/,
      end: /\}/
    },
    {
      begin: /</,
      end: />/
    }
  ];
  const escapeSigilEnd = (end) => {
    return {
      scope: "char.escape",
      begin: regex.concat(/\\/, end),
      relevance: 0
    };
  };
  const LOWERCASE_SIGIL = {
    className: "string",
    begin: "~[a-z](?=" + SIGIL_DELIMITERS + ")",
    contains: SIGIL_DELIMITER_MODES.map((x) => hljs.inherit(x, { contains: [
      escapeSigilEnd(x.end),
      BACKSLASH_ESCAPE,
      SUBST
    ] }))
  };
  const UPCASE_SIGIL = {
    className: "string",
    begin: "~[A-Z](?=" + SIGIL_DELIMITERS + ")",
    contains: SIGIL_DELIMITER_MODES.map((x) => hljs.inherit(x, { contains: [escapeSigilEnd(x.end)] }))
  };
  const REGEX_SIGIL = {
    className: "regex",
    variants: [
      {
        begin: "~r(?=" + SIGIL_DELIMITERS + ")",
        contains: SIGIL_DELIMITER_MODES.map((x) => hljs.inherit(x, {
          end: regex.concat(x.end, /[uismxfU]{0,7}/),
          contains: [
            escapeSigilEnd(x.end),
            BACKSLASH_ESCAPE,
            SUBST
          ]
        }))
      },
      {
        begin: "~R(?=" + SIGIL_DELIMITERS + ")",
        contains: SIGIL_DELIMITER_MODES.map((x) => hljs.inherit(x, {
          end: regex.concat(x.end, /[uismxfU]{0,7}/),
          contains: [escapeSigilEnd(x.end)]
        }))
      }
    ]
  };
  const STRING = {
    className: "string",
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ],
    variants: [
      {
        begin: /"""/,
        end: /"""/
      },
      {
        begin: /'''/,
        end: /'''/
      },
      {
        begin: /~S"""/,
        end: /"""/,
        contains: []
      },
      {
        begin: /~S"/,
        end: /"/,
        contains: []
      },
      {
        begin: /~S'''/,
        end: /'''/,
        contains: []
      },
      {
        begin: /~S'/,
        end: /'/,
        contains: []
      },
      {
        begin: /'/,
        end: /'/
      },
      {
        begin: /"/,
        end: /"/
      }
    ]
  };
  const FUNCTION = {
    className: "function",
    beginKeywords: "def defp defmacro defmacrop",
    end: /\B\b/,
    contains: [
      hljs.inherit(hljs.TITLE_MODE, {
        begin: ELIXIR_IDENT_RE,
        endsParent: true
      })
    ]
  };
  const CLASS = hljs.inherit(FUNCTION, {
    className: "class",
    beginKeywords: "defimpl defmodule defprotocol defrecord",
    end: /\bdo\b|$|;/
  });
  const ELIXIR_DEFAULT_CONTAINS = [
    STRING,
    REGEX_SIGIL,
    UPCASE_SIGIL,
    LOWERCASE_SIGIL,
    hljs.HASH_COMMENT_MODE,
    CLASS,
    FUNCTION,
    { begin: "::" },
    {
      className: "symbol",
      begin: ":(?![\\s:])",
      contains: [
        STRING,
        { begin: ELIXIR_METHOD_RE }
      ],
      relevance: 0
    },
    {
      className: "symbol",
      begin: ELIXIR_IDENT_RE + ":(?!:)",
      relevance: 0
    },
    {
      className: "title.class",
      begin: /(\b[A-Z][a-zA-Z0-9_]+)/,
      relevance: 0
    },
    NUMBER,
    {
      className: "variable",
      begin: "(\\$\\W)|((\\$|@@?)(\\w+))"
    }
  ];
  SUBST.contains = ELIXIR_DEFAULT_CONTAINS;
  return {
    name: "Elixir",
    aliases: [
      "ex",
      "exs"
    ],
    keywords: KWS,
    contains: ELIXIR_DEFAULT_CONTAINS
  };
};

// assets/app.js
var csrf_selector = 'meta[name="csrf-token"]';
var csrf_send_as = "X-CSRF-Token";
var is_dev = true;
window.otty = Otty.init(is_dev, AfterDive, csrf_selector, csrf_send_as);
core_default.registerLanguage("javascript", javascript);
core_default.registerLanguage("html", xml);
core_default.registerLanguage("elixir", elixir);
core_default.registerLanguage("json", elixir);
otty.highlighter = core_default;
otty.unitHandler = new UnitHandler(generic_default, [generic_default, debug_default, Syntax_default, more_otters_default]);
otty.handleNavigation();
