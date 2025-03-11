var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _isRendered, _props, _element, _RestaurantList_instances, attachClickEventListener_fn, deleteRestaurant_fn, attachKeyDownEventListener_fn, toggleLike_fn, appendRestaurantTab_fn, appendRestaurantDetail_fn, appendRestaurantList_fn, appendRestaurantAddModal_fn, appendRestaurantDetailModal_fn, addRestaurant_fn, removeModals_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class Component {
  constructor(props) {
    __privateAdd(this, _isRendered, false);
    __publicField(this, "state", {});
    __privateAdd(this, _props);
    __privateAdd(this, _element, document.createElement("div"));
    __privateSet(this, _props, props ?? null);
  }
  render() {
    __privateGet(this, _element).innerHTML = this.template();
    this.onRender();
    if (!__privateGet(this, _isRendered)) {
      this.attachEventListener();
      __privateSet(this, _isRendered, true);
    }
    return __privateGet(this, _element);
  }
  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    this.render();
  }
  appendChild(element, selector) {
    var _a;
    if (selector) (_a = this.element.querySelector(selector)) == null ? void 0 : _a.appendChild(element);
    else this.element.appendChild(element);
  }
  attachEventListener() {
  }
  onRender() {
  }
  get element() {
    return __privateGet(this, _element);
  }
  get props() {
    return __privateGet(this, _props);
  }
}
_isRendered = new WeakMap();
_props = new WeakMap();
_element = new WeakMap();
function isIterable(a) {
  return typeof (a === null || a === void 0 ? void 0 : a[Symbol.iterator]) === "function";
}
function isAsyncIterable(a) {
  return typeof (a === null || a === void 0 ? void 0 : a[Symbol.asyncIterator]) === "function";
}
function toIterator(iterable) {
  if (isIterable(iterable)) {
    return iterable[Symbol.iterator]();
  }
  if (isAsyncIterable(iterable)) {
    return iterable[Symbol.asyncIterator]();
  }
  throw new TypeError("toIterator: iterable must be type of Iterable or AsyncIterable");
}
const empty = function* () {
};
const isPromise = (a) => {
  if (a instanceof Promise) {
    return true;
  }
  if (a !== null && typeof a === "object" && typeof a.then === "function" && typeof a.catch === "function") {
    return true;
  }
  return false;
};
const isString = (input) => typeof input === "string";
function sync$7(f, iterable) {
  const iterator = iterable[Symbol.iterator]();
  return {
    next() {
      const { done, value } = iterator.next();
      if (done) {
        return {
          done: true,
          value: void 0
        };
      }
      return {
        done: false,
        value: f(value)
      };
    },
    [Symbol.iterator]() {
      return this;
    }
  };
}
function async$8(f, iterable) {
  const iterator = iterable[Symbol.asyncIterator]();
  return {
    async next(_concurrent) {
      const { done, value } = await iterator.next(_concurrent);
      if (done)
        return { done, value };
      return {
        done: false,
        value: await f(value)
      };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function map(f, iterable) {
  if (iterable === void 0) {
    return (iterable2) => {
      return map(f, iterable2);
    };
  }
  if (isIterable(iterable)) {
    return sync$7(f, iterable);
  }
  if (isAsyncIterable(iterable)) {
    return async$8(f, iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
const pipe1 = (a, f) => {
  return isPromise(a) ? a.then(f) : f(a);
};
function sync$6(f, acc, iterable) {
  for (const a of iterable) {
    acc = f(acc, a);
  }
  return acc;
}
async function async$7(f, acc, iterable) {
  for await (const a of iterable) {
    acc = await pipe1(acc, (acc2) => f(acc2, a));
  }
  return acc;
}
function reduce(f, seed, iterable) {
  if (iterable === void 0) {
    if (seed === void 0) {
      return (iterable2) => reduce(f, iterable2);
    }
    if (isIterable(seed)) {
      const iterator = seed[Symbol.iterator]();
      const { done, value } = iterator.next();
      if (done) {
        throw new TypeError("'reduce' of empty iterable with no initial value");
      }
      return sync$6(f, value, {
        [Symbol.iterator]() {
          return iterator;
        }
      });
    }
    if (isAsyncIterable(seed)) {
      const iterator = seed[Symbol.asyncIterator]();
      return iterator.next().then(({ done, value }) => {
        if (done) {
          throw new TypeError("'reduce' of empty iterable with no initial value");
        }
        return async$7(f, value, {
          [Symbol.asyncIterator]() {
            return iterator;
          }
        });
      });
    }
    throw new TypeError("'iterable' must be type of Iterable or AsyncIterable. Are you looking for 'reduceLazy'?");
  }
  if (isIterable(iterable)) {
    return sync$6(f, seed, iterable);
  }
  if (isAsyncIterable(iterable)) {
    return async$7(f, Promise.resolve(seed), iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
function pipe(a, ...fns) {
  return reduce(pipe1, a, fns);
}
function* range(start, end, step = 1) {
  if (end === void 0)
    return yield* range(0, start);
  if (step < 0) {
    while (start > end) {
      yield start;
      start += step;
    }
  } else {
    while (start < end) {
      yield start;
      start += step;
    }
  }
}
class AsyncFunctionException extends Error {
  constructor(message = AsyncFunctionException.MESSAGE) {
    super(message);
  }
}
AsyncFunctionException.MESSAGE = `'Iterable' can not used with async function.
If you want to deal with async function, see: [toAsync](https://fxts.dev/docs/toAsync)`;
const throwIfPromiseError = (a) => {
  if (isPromise(a)) {
    throw new AsyncFunctionException();
  }
  return a;
};
class Concurrent {
  constructor(length) {
    this.length = length;
  }
  static of(length) {
    return new Concurrent(length);
  }
}
const isConcurrent = (concurrent2) => {
  return concurrent2 instanceof Concurrent;
};
function concurrent(length, iterable) {
  if (iterable === void 0) {
    return (iterable2) => {
      return concurrent(length, iterable2);
    };
  }
  if (!Number.isFinite(length) || length <= 0) {
    throw new RangeError("'length' must be positive integer");
  }
  if (!isAsyncIterable(iterable)) {
    throw new TypeError("'iterable' must be type of AsyncIterable");
  }
  const iterator = iterable[Symbol.asyncIterator]();
  const buffer = [];
  let prev = Promise.resolve();
  let nextCallCount = 0;
  let resolvedItemCount = 0;
  let finished = false;
  let pending = false;
  const settlementQueue = [];
  const consumeBuffer = () => {
    while (buffer.length > 0 && nextCallCount > resolvedItemCount) {
      const p = buffer.shift();
      const [resolve, reject] = settlementQueue.shift();
      if (p.status === "fulfilled") {
        resolvedItemCount++;
        resolve(p.value);
        if (p.value.done) {
          finished = true;
        }
      } else {
        reject(p.reason);
        finished = true;
        break;
      }
    }
  };
  const fillBuffer = () => {
    if (pending) {
      prev = prev.then(() => void (!finished && nextCallCount > resolvedItemCount && fillBuffer()));
    } else {
      const nextItems = Promise.allSettled(Array.from({ length }, () => iterator.next(Concurrent.of(length))));
      pending = true;
      prev = prev.then(() => nextItems).then((nextItems2) => {
        buffer.push(...nextItems2);
        pending = false;
        recur();
      });
    }
  };
  function recur() {
    if (finished || nextCallCount === resolvedItemCount) {
      return;
    } else if (buffer.length > 0) {
      consumeBuffer();
    } else {
      fillBuffer();
    }
  }
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      nextCallCount++;
      if (finished) {
        return { done: true, value: void 0 };
      }
      return new Promise((resolve, reject) => {
        settlementQueue.push([resolve, reject]);
        recur();
      });
    }
  };
}
function* sync$5(f, iterable) {
  for (const item of iterable) {
    yield item;
    const res = f(item);
    if (isPromise(res)) {
      throw new AsyncFunctionException();
    }
    if (res) {
      break;
    }
  }
}
function asyncSequential$3(f, iterable) {
  const iterator = iterable[Symbol.asyncIterator]();
  let end = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      if (end) {
        return { done: true, value: void 0 };
      }
      const { done, value } = await iterator.next(_concurrent);
      if (done || end) {
        return { done: true, value: void 0 };
      }
      const cond = await f(value);
      if (end) {
        return { done: true, value: void 0 };
      }
      if (cond) {
        end = true;
      }
      return { done: false, value };
    }
  };
}
function async$6(f, iterable) {
  let _iterator;
  return {
    async next(_concurrent) {
      if (_iterator === void 0) {
        _iterator = isConcurrent(_concurrent) ? asyncSequential$3(f, concurrent(_concurrent.length, iterable)) : asyncSequential$3(f, iterable);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function takeUntil(f, iterable) {
  if (iterable === void 0) {
    return (iterable2) => {
      return takeUntil(f, iterable2);
    };
  }
  if (isIterable(iterable)) {
    return sync$5(f, iterable);
  }
  if (isAsyncIterable(iterable)) {
    return async$6(f, iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
function not(a) {
  return !a;
}
function every(f, iterable) {
  if (iterable === void 0) {
    return (iterable2) => {
      return every(f, iterable2);
    };
  }
  if (isIterable(iterable)) {
    return pipe(map((a) => throwIfPromiseError(f(a)), iterable), takeUntil(not), (acc) => reduce((a, b) => a && b, true, acc), (a) => a !== null && a !== void 0 ? a : true, Boolean);
  }
  if (isAsyncIterable(iterable)) {
    return pipe(map(f, iterable), takeUntil(not), (acc) => reduce((a, b) => a && b, true, acc), (a) => a !== null && a !== void 0 ? a : true, Boolean);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
async function async$5(iterable) {
  const res = [];
  for await (const item of iterable) {
    res.push(item);
  }
  return res;
}
function toArray(iter) {
  if (isAsyncIterable(iter)) {
    return async$5(iter);
  } else if (isIterable(iter)) {
    return Array.from(iter);
  } else {
    return [];
  }
}
const isArray = (input) => Array.isArray(input);
function last(iterable) {
  if (isArray(iterable) || isString(iterable)) {
    return iterable[iterable.length - 1];
  }
  if (isIterable(iterable)) {
    return reduce((_, a) => a, iterable);
  } else if (isAsyncIterable(iterable)) {
    return reduce((_, a) => a, iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
function toAsync(iter) {
  const iterator = iter[Symbol.iterator]();
  return {
    async next() {
      const { value, done } = iterator.next();
      if (isPromise(value)) {
        return value.then((value2) => ({ done, value: value2 }));
      } else {
        return { done, value };
      }
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function* sync$4(f, iterable) {
  for (const item of iterable) {
    const res = f(item);
    if (isPromise(res)) {
      throw new AsyncFunctionException();
    }
    if (!res) {
      break;
    }
    yield item;
  }
}
function asyncSequential$2(f, iterable) {
  const iterator = iterable[Symbol.asyncIterator]();
  let end = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      const { done, value } = await iterator.next(_concurrent);
      if (done || end) {
        return { done: true, value: void 0 };
      }
      if (!await f(value)) {
        end = true;
        return { done: true, value: void 0 };
      }
      return { done: false, value };
    }
  };
}
function async$4(f, iterable) {
  let _iterator;
  return {
    async next(_concurrent) {
      if (_iterator === void 0) {
        _iterator = isConcurrent(_concurrent) ? asyncSequential$2(f, concurrent(_concurrent.length, iterable)) : asyncSequential$2(f, iterable);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function takeWhile(f, iterable) {
  if (iterable === void 0) {
    return (iterable2) => {
      return takeWhile(f, iterable2);
    };
  }
  if (isIterable(iterable)) {
    return sync$4(f, iterable);
  }
  if (isAsyncIterable(iterable)) {
    return async$4(f, iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
function sync$3(iterable) {
  const iterators = toArray(map((a) => toIterator(a), iterable));
  return pipe(range(Infinity), map(() => toArray(map((it) => it.next(), iterators))), takeWhile(every((cur2) => !cur2.done)), map((cur1) => toArray(map((cur2) => cur2.value, cur1))));
}
function async$3(iterable) {
  const iterators = toArray(map(toIterator, iterable));
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      const headIterators = await pipe(toAsync(iterators), map((it) => it.next(_concurrent)), toArray);
      const hasDone = headIterators.some((it) => it.done);
      if (hasDone) {
        return { done: true, value: void 0 };
      }
      return {
        done: false,
        value: headIterators.map((it) => it.value)
      };
    }
  };
}
function zip(...iterables) {
  if (iterables.length < 2) {
    return (...iterables2) => {
      return zip(...iterables, ...iterables2);
    };
  }
  if (iterables.some((a) => !isIterable(a) && !isAsyncIterable(a))) {
    throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
  }
  const hasAsyncIterable = iterables.some((iterable) => isAsyncIterable(iterable));
  if (hasAsyncIterable) {
    return async$3(iterables);
  }
  return sync$3(iterables);
}
function* sync$2(a, iterable) {
  yield* iterable;
  yield a;
}
function asyncSequential$1(a, iterable) {
  const iterator = iterable[Symbol.asyncIterator]();
  let finished = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      if (finished) {
        return { done: true, value: void 0 };
      }
      const { value, done } = await iterator.next();
      if (finished) {
        return { done: true, value: void 0 };
      }
      if (done) {
        finished = true;
        return { done: false, value: await a };
      } else {
        return { done, value };
      }
    }
  };
}
function async$2(a, iterable) {
  let iterator = null;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      if (iterator === null) {
        iterator = isConcurrent(_concurrent) ? asyncSequential$1(a, concurrent(_concurrent.length, iterable)) : asyncSequential$1(a, iterable);
      }
      return iterator.next(_concurrent);
    }
  };
}
function append(a, iterable) {
  if (iterable === void 0) {
    return (iterable2) => append(a, iterable2);
  }
  if (isAsyncIterable(iterable)) {
    return async$2(isPromise(a) ? a : Promise.resolve(a), iterable);
  }
  if (isIterable(iterable)) {
    return sync$2(a, iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
function* sync$1(a, b) {
  yield* a;
  yield* b;
}
function async$1(a, b) {
  let leftDone = false;
  const leftIterator = a[Symbol.asyncIterator]();
  const rightIterator = b[Symbol.asyncIterator]();
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      const iterator = leftDone ? rightIterator : leftIterator;
      const { done, value } = await iterator.next(_concurrent);
      if (done) {
        if (iterator === leftIterator) {
          leftDone = true;
        }
        return rightIterator.next(_concurrent);
      } else {
        return { done, value };
      }
    }
  };
}
function toAsyncIterable(iterable) {
  if (isAsyncIterable(iterable)) {
    return iterable;
  }
  const iterator = iterable[Symbol.iterator]();
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function concat(iterable1, iterable2) {
  if (iterable2 === void 0) {
    return (iterable22) => {
      return concat(iterable1, iterable22);
    };
  }
  if (isAsyncIterable(iterable1) || isAsyncIterable(iterable2)) {
    return async$1(toAsyncIterable(iterable1), toAsyncIterable(iterable2));
  }
  if (isIterable(iterable1) && isIterable(iterable2)) {
    return sync$1(iterable1, iterable2);
  }
  throw new TypeError("'iterable1','iterable2' must be type of Iterable or AsyncIterable");
}
const isFlatAble = function(a) {
  return typeof a !== "string" && isIterable(a);
};
function sync(iterable, depth) {
  const iterator = iterable[Symbol.iterator]();
  const iteratorStack = [
    iterator
  ];
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      while (iteratorStack.length > 0) {
        const currentIterator = last(iteratorStack);
        const { value, done } = currentIterator.next();
        if (done) {
          iteratorStack.pop();
          continue;
        }
        if (isFlatAble(value) && iteratorStack.length < depth + 1) {
          iteratorStack.push(value[Symbol.iterator]());
          continue;
        }
        return {
          done: false,
          value
        };
      }
      return {
        done: true,
        value: void 0
      };
    }
  };
}
function asyncConcurrent(iterable, depth) {
  const originIterator = iterable[Symbol.asyncIterator]();
  let prevItem = Promise.resolve();
  let flattenIterator = empty();
  let finished = false;
  const settlementQueue = [];
  const fillItem = async () => {
    const { done, value } = await originIterator.next();
    if (done) {
      return false;
    }
    if (isFlatAble(value)) {
      flattenIterator = concat(sync(value, depth - 1), flattenIterator);
    } else {
      flattenIterator = append(value, flattenIterator);
    }
    return true;
  };
  const pullItem = async () => {
    if (finished) {
      return { done: true, value: void 0 };
    }
    const { value, done } = flattenIterator.next();
    if (done) {
      const hasItem = await fillItem();
      if (hasItem) {
        return pullItem();
      }
      return { done: true, value: void 0 };
    }
    return { done: false, value };
  };
  const resolveItem = ({ done, value }) => {
    if (done || finished) {
      while (settlementQueue.length > 0) {
        const [resolve2] = settlementQueue.shift();
        resolve2({ done: true, value: void 0 });
      }
      return;
    }
    const [resolve] = settlementQueue.shift();
    resolve({ done, value });
  };
  const catchItem = (err) => {
    finished = true;
    const [_, reject] = settlementQueue.shift();
    reject(err);
  };
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      return new Promise((resolve, reject) => {
        settlementQueue.push([resolve, reject]);
        prevItem = prevItem.then(() => pullItem()).then(resolveItem).catch(catchItem);
      });
    }
  };
}
function asyncSequential(iterable, depth) {
  const iterator = iterable[Symbol.asyncIterator]();
  const iteratorStack = [
    iterator
  ];
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      const iterator2 = last(iteratorStack);
      if (!iterator2) {
        return { done: true, value: void 0 };
      }
      const { value, done } = await iterator2.next();
      if (done) {
        iteratorStack.pop();
        return this.next();
      }
      if (isFlatAble(value) && iteratorStack.length < depth + 1) {
        iteratorStack.push(value[Symbol.iterator]());
        return this.next();
      }
      return {
        done: false,
        value
      };
    }
  };
}
function async(iterable, depth) {
  let _iterator = null;
  return {
    async next(_concurrent) {
      if (_iterator === null) {
        _iterator = isConcurrent(_concurrent) ? asyncConcurrent(concurrent(_concurrent.length, iterable), depth) : asyncSequential(iterable, depth);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function flat(iterable, depth = 1) {
  if (isIterable(iterable)) {
    return sync(iterable, depth);
  }
  if (isAsyncIterable(iterable)) {
    return async(iterable, depth);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
function html(strings, ...values) {
  return pipe(
    zip(
      strings,
      concat(
        map((value) => value instanceof Component ? value.template() : value, values),
        [""]
      )
    ),
    flat,
    reduce((a, b) => a + b)
  );
}
function generateId() {
  return Math.random().toString(16).slice(2);
}
class Button extends Component {
  template() {
    var _a, _b, _c, _d, _e, _f;
    return html` <button
      class="button text-caption ${(_a = this.props) == null ? void 0 : _a.class}"
      ${((_b = this.props) == null ? void 0 : _b.type) ? `type = ${(_c = this.props) == null ? void 0 : _c.type}` : ""}
      ${((_d = this.props) == null ? void 0 : _d.id) ? `id = ${(_e = this.props) == null ? void 0 : _e.id}` : ""}
    >
      ${(_f = this.props) == null ? void 0 : _f.message}
    </button>`;
  }
}
class Header extends Component {
  template() {
    var _a;
    return `
      <header class="gnb">
        <h1 class="gnb__title text-title">${((_a = this.props) == null ? void 0 : _a.title) ?? ""}</h1>
        <button type="button" class="gnb__button" aria-label="음식점 추가">
          <img src="./public/images/add-button.png" alt="음식점 추가" />
        </button>
      </header>
    `;
  }
  attachEventListener() {
    var _a;
    (_a = this.element) == null ? void 0 : _a.addEventListener("click", () => {
      var _a2;
      (_a2 = document.querySelector("#restaurant-add-modal")) == null ? void 0 : _a2.classList.add("modal--open");
    });
  }
}
class InputBox extends Component {
  template() {
    var _a, _b, _c, _d, _e;
    return `
      <div class="form-item ${((_a = this.props) == null ? void 0 : _a.isRequired) ? "form-item--required" : ""}">
        <label for="${(_b = this.props) == null ? void 0 : _b.labelId}" class="text-caption">${((_c = this.props) == null ? void 0 : _c.label) ?? ""}</label>
        ${((_d = this.props) == null ? void 0 : _d.input) ?? ""}
        <span class="help-text text-caption">${((_e = this.props) == null ? void 0 : _e.caption) ?? ""}</span>
      </div>
    `;
  }
}
class Modal extends Component {
  template() {
    var _a, _b;
    return html`
      <div class="modal" id="${((_a = this.props) == null ? void 0 : _a.id) ?? ""}">
        <div class="modal-backdrop"></div>
        <div class="modal-container">${((_b = this.props) == null ? void 0 : _b.children) ?? ""}</div>
      </div>
    `;
  }
}
const CATEGORY_MAP = {
  한식: "korean",
  중식: "chinese",
  일식: "japanese",
  양식: "western",
  아시안: "asian",
  기타: "etc"
};
const LOCAL_STORAGE_KEY_MAP = {
  restaurants: "restaurants"
};
class Restaurant extends Component {
  template() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    return `
      <li class="restaurant" data-id="${((_a = this.props) == null ? void 0 : _a.id) ?? ""}">
      <div class="restaurant__category">
        <img
          src="./public/images/category-${CATEGORY_MAP[(_b = this.props) == null ? void 0 : _b.category]}.png"
          alt="${((_c = this.props) == null ? void 0 : _c.category) ?? ""}"
          class="category-icon"
        />
      </div>
      <div class="restaurant__info">
        <div class="restaurant__info--inner">
          <div>
            <h3 class="restaurant__name text-subtitle">${((_d = this.props) == null ? void 0 : _d.name) ?? ""}</h3>
            <span class="restaurant__distance text-body">캠퍼스부터 ${((_e = this.props) == null ? void 0 : _e.distance) ?? 5}분 내</span>
          </div>
          ${((_f = this.props) == null ? void 0 : _f.isLike) ? `<img src="./public/images/star_filled.svg" alt="음식점 추가" id="like__button" data-id="${((_g = this.props) == null ? void 0 : _g.id) ?? ""}" />` : `<img src="./public/images/star.svg" alt="음식점 추가" id="like__button" data-id="${((_h = this.props) == null ? void 0 : _h.id) ?? ""}" />`}
        </div>
        <p class="restaurant__description text-body">
          ${((_i = this.props) == null ? void 0 : _i.description) ?? ""}
        </p>
      </div>
    </li>`;
  }
}
class RestaurantList extends Component {
  constructor() {
    super();
    __privateAdd(this, _RestaurantList_instances);
    const localStorageRestaurants = localStorage.getItem(LOCAL_STORAGE_KEY_MAP.restaurants);
    const initialRestaurants = localStorageRestaurants ? JSON.parse(localStorageRestaurants) : [];
    this.state = {
      restaurants: initialRestaurants,
      tab: "all",
      filter: "전체",
      sort: "이름순",
      currentRestaurant: null
    };
  }
  template() {
    return `
      <section class="restaurant-tab"></section>
      <section class="restaurant-detail"></section>
      <section class="restaurant-list-container">
        <ul class="restaurant-list">

        </ul>
      </section>
      <section class="restaurant-add-modal"></section>
      <section class="restaurant-detail-modal"></section>
    `;
  }
  /**
   * 이벤트 리스너
   */
  attachEventListener() {
    __privateMethod(this, _RestaurantList_instances, attachClickEventListener_fn).call(this);
    __privateMethod(this, _RestaurantList_instances, attachKeyDownEventListener_fn).call(this);
  }
  /**
   * 자식 컴포넌트 렌더링
   */
  onRender() {
    __privateMethod(this, _RestaurantList_instances, appendRestaurantTab_fn).call(this);
    __privateMethod(this, _RestaurantList_instances, appendRestaurantDetail_fn).call(this);
    __privateMethod(this, _RestaurantList_instances, appendRestaurantList_fn).call(this);
    __privateMethod(this, _RestaurantList_instances, appendRestaurantAddModal_fn).call(this);
    __privateMethod(this, _RestaurantList_instances, appendRestaurantDetailModal_fn).call(this);
  }
}
_RestaurantList_instances = new WeakSet();
attachClickEventListener_fn = function() {
  window.addEventListener("click", (event) => {
    var _a, _b;
    if (!event.target) return;
    const target = event.target;
    if (target.closest("#modal-cancel") || target.closest(".modal-backdrop")) {
      __privateMethod(this, _RestaurantList_instances, removeModals_fn).call(this);
      return;
    }
    if (target.closest("#like__button") && target.dataset.id) {
      __privateMethod(this, _RestaurantList_instances, toggleLike_fn).call(this, target.dataset.id);
      return;
    }
    if (target.closest(".restaurant")) {
      this.setState({
        currentRestaurant: this.state.restaurants.find(
          (restaurant) => restaurant.id === target.closest(".restaurant").dataset.id
        )
      });
      (_a = this.element.querySelector("#restaurant-detail-modal")) == null ? void 0 : _a.classList.add("modal--open");
      return;
    }
    if (target.closest("#modal-delete")) {
      __privateMethod(this, _RestaurantList_instances, deleteRestaurant_fn).call(this, ((_b = this.state.currentRestaurant) == null ? void 0 : _b.id) ?? "");
      __privateMethod(this, _RestaurantList_instances, removeModals_fn).call(this);
      return;
    }
  });
};
deleteRestaurant_fn = function(id) {
  this.setState({
    restaurants: this.state.restaurants.filter((restaurant) => restaurant.id !== id)
  });
  localStorage.setItem(LOCAL_STORAGE_KEY_MAP.restaurants, JSON.stringify(this.state.restaurants));
};
attachKeyDownEventListener_fn = function() {
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") __privateMethod(this, _RestaurantList_instances, removeModals_fn).call(this);
  });
};
toggleLike_fn = function(restaurantName) {
  const copiedRestaurants = [...this.state.restaurants];
  const currentRestaurantIndex = this.state.restaurants.findIndex((restaurant) => restaurant.id === restaurantName);
  const targetRestaurant = this.state.restaurants[currentRestaurantIndex];
  copiedRestaurants.splice(currentRestaurantIndex, 1, { ...targetRestaurant, isLike: !targetRestaurant.isLike });
  this.setState({
    restaurants: copiedRestaurants
  });
  localStorage.setItem(LOCAL_STORAGE_KEY_MAP.restaurants, JSON.stringify(this.state.restaurants));
};
appendRestaurantTab_fn = function() {
  this.appendChild(
    new RestaurantTab({
      setTab: (tab) => this.setState({
        tab
      }),
      focusedTab: this.state.tab
    }).render(),
    ".restaurant-tab"
  );
};
appendRestaurantDetail_fn = function() {
  this.appendChild(
    new RestaurantDetail({
      filter: this.state.filter,
      sort: this.state.sort,
      setFilter: (filter) => this.setState({
        filter
      }),
      setSort: (sort) => this.setState({
        sort
      })
    }).render(),
    ".restaurant-detail"
  );
};
appendRestaurantList_fn = function() {
  const filteredRestaurants = [...this.state.restaurants].filter((restaurant) => this.state.tab === "all" || restaurant.isLike).filter((restaurant) => this.state.filter === "전체" || restaurant.category === this.state.filter).sort(
    (a, b) => this.state.sort === "이름순" ? a.name < b.name ? -1 : a.name > b.name ? 1 : 0 : a.distance - b.distance
  );
  filteredRestaurants.forEach((restaurant) => {
    this.appendChild(new Restaurant(restaurant).render(), ".restaurant-list");
  });
};
appendRestaurantAddModal_fn = function() {
  const restaurantAddModal = new RestaurantAddModal({
    addRestaurant: __privateMethod(this, _RestaurantList_instances, addRestaurant_fn).bind(this)
  });
  this.appendChild(restaurantAddModal.render(), ".restaurant-add-modal");
};
appendRestaurantDetailModal_fn = function() {
  const restaurantDetailModal = new RestaurantDetailModal(this.state.currentRestaurant);
  this.appendChild(restaurantDetailModal.render(), ".restaurant-detail-modal");
};
addRestaurant_fn = function(restaurant) {
  this.setState({
    restaurants: [...this.state.restaurants, restaurant]
  });
  localStorage.setItem(LOCAL_STORAGE_KEY_MAP.restaurants, JSON.stringify(this.state.restaurants));
};
removeModals_fn = function() {
  this.element.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("modal--open");
  });
};
class RestaurantAddModal extends Component {
  template() {
    const inputBoxList = [
      new InputBox({
        input: html` <select name="category" id="category" required>
          <option value="">선택해 주세요</option>
          <option value="한식">한식</option>
          <option value="중식">중식</option>
          <option value="일식">일식</option>
          <option value="양식">양식</option>
          <option value="아시안">아시안</option>
          <option value="기타">기타</option>
        </select>`,
        label: "카테고리",
        isRequired: true,
        labelId: "category"
      }),
      new InputBox({
        input: html`<input type="text" name="name" id="name" maxlength="20" required />`,
        label: "이름",
        isRequired: true,
        labelId: "name"
      }),
      new InputBox({
        input: html` <select name="distance" id="distance" required>
          <option value="">선택해 주세요</option>
          <option value="5">5분 내</option>
          <option value="10">10분 내</option>
          <option value="15">15분 내</option>
          <option value="20">20분 내</option>
          <option value="30">30분 내</option>
        </select>`,
        label: "거리(도보 이동 시간)",
        isRequired: true,
        labelId: "distance"
      }),
      new InputBox({
        input: html`<textarea maxlength="1000" name="description" id="description" cols="30" rows="5"></textarea>`,
        label: "설명",
        caption: "메뉴 등 추가 정보를 입력해 주세요.",
        isRequired: false,
        labelId: "description"
      }),
      new InputBox({
        input: html`<input type="url" name="url" id="url" />`,
        label: "참고 링크",
        caption: "매장 정보를 확인할 수 있는 링크를 입력해 주세요.",
        isRequired: false,
        labelId: "url"
      })
    ];
    const cancelButton = new Button({
      type: "button",
      class: "button--secondary",
      id: "modal-cancel",
      message: "취소하기"
    });
    const addButton = new Button({
      type: "submit",
      class: "button--primary",
      id: "modal-add",
      message: "추가하기"
    });
    const modal = new Modal({
      id: "restaurant-add-modal",
      children: html`
        <h2 class="modal-title text-title">새로운 음식점</h2>
        <form>
          ${inputBoxList.map((input) => html`${input}`).join("")}
          <div class="button-container">${cancelButton} ${addButton}</div>
        </form>
      `
    });
    return html`${modal}`;
  }
  attachEventListener() {
    const form = this.element.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      var _a;
      event.preventDefault();
      const id = generateId();
      const formData = new FormData(event.target);
      const modalInput = { ...Object.fromEntries(formData), id };
      (_a = this.props) == null ? void 0 : _a.addRestaurant(modalInput);
    });
  }
}
class RestaurantTab extends Component {
  template() {
    var _a, _b;
    return `
      <div class="restaurant__tab-list">
        <div class="restaurant__tab-item ${((_a = this.props) == null ? void 0 : _a.focusedTab) === "all" ? "restaurant__tab-item--active" : ""}" data-tab="all" id="tab-all">
          <span>모든 음식점</span>
        </div>
        <div class="restaurant__tab-item ${((_b = this.props) == null ? void 0 : _b.focusedTab) === "like" ? "restaurant__tab-item--active" : ""}" data-tab="like" id="tab-like">
          <span>자주 가는 음식점</span>
        </div>
      </div>
    `;
  }
  attachEventListener() {
    var _a;
    (_a = this.element) == null ? void 0 : _a.querySelectorAll(".restaurant__tab-item").forEach((tabItem) => {
      tabItem.addEventListener("click", (event) => {
        var _a2, _b;
        (_b = this.props) == null ? void 0 : _b.setTab((_a2 = event == null ? void 0 : event.currentTarget) == null ? void 0 : _a2.dataset.tab);
      });
    });
  }
}
class RestaurantDetail extends Component {
  template() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return `
      <div class="restaurant-filter-container">
        <select name="filter" id="filter" class="restaurant-filter">
          <option value="전체" >전체</option>
          <option value="한식" ${((_a = this.props) == null ? void 0 : _a.filter) === "한식" ? "selected" : ""} >한식</option>
          <option value="중식" ${((_b = this.props) == null ? void 0 : _b.filter) === "중식" ? "selected" : ""} >중식</option>
          <option value="일식" ${((_c = this.props) == null ? void 0 : _c.filter) === "일식" ? "selected" : ""} >일식</option>
          <option value="양식" ${((_d = this.props) == null ? void 0 : _d.filter) === "양식" ? "selected" : ""} >양식</option>
          <option value="아시안" ${((_e = this.props) == null ? void 0 : _e.filter) === "아시안" ? "selected" : ""}>아시안</option>
          <option value="기타" ${((_f = this.props) == null ? void 0 : _f.filter) === "기타" ? "selected" : ""} >기타</option>
        </select>

        <select name="sort" id="sort">
          <option value="이름순" ${((_g = this.props) == null ? void 0 : _g.sort) === "이름순" ? "selected" : ""}>이름순</option>
          <option value="거리순" ${((_h = this.props) == null ? void 0 : _h.sort) === "거리순" ? "selected" : ""}>거리순</option>
        </select>
      </div>
    `;
  }
  attachEventListener() {
    var _a, _b, _c, _d;
    (_b = (_a = this.element) == null ? void 0 : _a.querySelector("#filter")) == null ? void 0 : _b.addEventListener("change", (event) => {
      var _a2, _b2;
      (_b2 = this.props) == null ? void 0 : _b2.setFilter((_a2 = event == null ? void 0 : event.target) == null ? void 0 : _a2.value);
    });
    (_d = (_c = this.element) == null ? void 0 : _c.querySelector("#sort")) == null ? void 0 : _d.addEventListener("change", (event) => {
      var _a2, _b2;
      (_b2 = this.props) == null ? void 0 : _b2.setSort((_a2 = event == null ? void 0 : event.target) == null ? void 0 : _a2.value);
    });
  }
}
class RestaurantDetailModal extends Component {
  template() {
    const currentRestaurant = this.props ?? null;
    const deleteButton = new Button({
      type: "button",
      class: "button--secondary",
      id: "modal-delete",
      message: "삭제하기"
    });
    const cancelButton = new Button({
      type: "button",
      class: "button--primary",
      id: "modal-cancel",
      message: "닫기"
    });
    return html`
      ${new Modal({
      id: "restaurant-detail-modal",
      children: html`
          <div class="restaurant-detail-modal">
            <div class="restaurant-detail-modal__header">
              <div class="restaurant__category">
                <img
                  src="./public/images/category-${CATEGORY_MAP[currentRestaurant == null ? void 0 : currentRestaurant.category]}.png"
                  alt="${(currentRestaurant == null ? void 0 : currentRestaurant.category) ?? ""}"
                  class="category-icon"
                />
              </div>
              ${(currentRestaurant == null ? void 0 : currentRestaurant.isLike) ? `<img src="./public/images/star_filled.svg" alt="음식점 추가" id="like__button" data-id="${currentRestaurant == null ? void 0 : currentRestaurant.id}" />` : `<img src="./public/images/star.svg" alt="음식점 추가" id="like__button" data-id="${currentRestaurant == null ? void 0 : currentRestaurant.id}" />`}
            </div>
            <div class="restaurant__info">
              <div class="restaurant__info--inner">
                <div>
                  <h3 class="restaurant__name text-subtitle">${(currentRestaurant == null ? void 0 : currentRestaurant.name) ?? ""}</h3>
                  <span class="restaurant-detail-modal__distance text-body"
                    >캠퍼스부터 ${(currentRestaurant == null ? void 0 : currentRestaurant.distance) ?? 5}분 내</span
                  >
                </div>
              </div>
              <p class="text-body">${(currentRestaurant == null ? void 0 : currentRestaurant.description) ?? ""}</p>
              <a class="text-body restaurant-detail-modal__url" href="${(currentRestaurant == null ? void 0 : currentRestaurant.url) ?? ""}" target="_blank">
                ${(currentRestaurant == null ? void 0 : currentRestaurant.url) ?? ""}
              </a>
              <div class="button-container">${deleteButton} ${cancelButton}</div>
            </div>
          </div>
        `
    })}
    `;
  }
}
class Application extends Component {
  template() {
    return ``;
  }
  onRender() {
    this.appendChild(new Header({ title: "오늘 뭐 먹지" }).render());
    this.appendChild(new RestaurantList().render());
  }
}
addEventListener("load", () => {
  const app = document.querySelector("#app");
  if (!app) return;
  app.appendChild(new Application().render());
});
