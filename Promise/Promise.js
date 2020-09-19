class CPromise {
  #status;
  #resolveQueue;
  #rejectQueue;
  #value;
  constructor(executeFn) {
    this.#status = "pending";
    this.#resolveQueue = [];
    this.#rejectQueue = [];
    this.#value = undefined;
    const resolve = (val) => {
      const exFn = () => {
        if (this.#status !== "pending") return;
        this.#status = "fulfilled";
        while (this.#resolveQueue.length) {
          const callback = this.#resolveQueue.shift();
          callback(val);
        }
      };
      setTimeout(exFn);
    };
    const reject = (val) => {
      const exFn = () => {
        if (this.#status !== "pending") return;
        this.#status = "rejected";
        while (this.#rejectQueue.length) {
          const callback = this.#rejectQueue.shift();
          callback(val);
        }
      };
      setTimeout(exFn);
    };
    executeFn(resolve, reject);
  }

  then(resFn, rejFn) {
    if (typeof resFn !== "function") {
      resFn = (value) => value;
    }
    if (typeof rejFn !== "function") {
      rejFn = (errors) => errors;
    }
    return new CPromise((resolve, reject) => {
      const fulfilledFn = (value) => {
        try {
          // 获取then的返回值
          let x = resFn(value);
          // 如果是Promise对象，执行一次新的then添加到订阅队列，如果不是，则直接解析
          // 这段代码可以仔细思考一下，如果你then返回的Promise对象，后面链式调用的then其实你新实例化对象的then方法了。
          // 如果then返回的是新的Promise对象A，这里首先 x instanceof CPromise 为 true， 并执行一次你返回Promise对象A的then收集到订阅队列
          // 当你Promise对象A的resolve执行时，执行队列里的函数发布更新，而更新的函数就是当前then方法内自带的实例化Promise的resolve。
          x instanceof CPromise ? x.then(resolve, reject) : resolve(x);
        } catch (error) {
          reject(error);
        }
      };
      const rejectedFn = (error) => {
        try {
          let x = rejFn(error);
          x instanceof CPromise ? x.then(resolve, reject) : reject(x);
        } catch (error) {
          reject(error);
        }
      };
      switch (this.#status) {
        case "pending":
          this.#resolveQueue.push(fulfilledFn);
          this.#rejectQueue.push(rejectedFn);
          break;
        case "fulfilled":
          fulfilledFn(this.#value);
          break;
        case "rejected":
          rejectedFn(this.#value);
          break;
        default:
          break;
      }
    });
  }

  //catch
  catch(rejectFn) {
    return this.then(undefined, rejectFn);
  }

  //finally方法
  finally(callback) {
    return this.then(
      (value) => CPromise.resolve(callback()).then(() => value),
      (reason) =>
        CPromise.resolve(callback()).then(() => {
          throw reason;
        })
    );
  }

  //静态的resolve方法
  static resolve(value) {
    if (value instanceof CPromise) return value;
    return new CPromise((resolve) => resolve(value));
  }

  //静态的reject方法
  static reject(reason) {
    return new CPromise((resolve, reject) => reject(reason));
  }

  // 静态all
  static all(promiseArr) {
    let index = 0;
    let result = [];
    return new CPromise((resolve, reject) => {
      promiseArr.forEach((p, i) => {
        CPromise.resolve(p).then(
          (val) => {
            index++;
            result[i] = val;
            if (index === promiseArr.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }
}
