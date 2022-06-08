import "reflect-metadata";

export const minimumValue = (propName: string, min: number) =>
  (constructor: any,
    methodName: string,
    descriptor: PropertyDescriptor): any => {

    const origFunction = descriptor.value;
    descriptor.value = async function wrapper(...args) {
      let result = await origFunction.apply(this, args);
      return result.map(r => ({
        ...r,
        [propName]: r[propName] < min ?
          min : r[propName]
      }));
    };
  };

export const addClass = (selector: string, ...className: string[]) =>
  (constructor: any,
    methodName: string,
    descriptor: PropertyDescriptor): any => {

    if (Reflect.getMetadata("design:returntype", constructor, methodName) === HTMLElement) {
      const origFunction = descriptor.value;
      descriptor.value = function wrapper(...args) {
        let content: HTMLElement = origFunction.apply(this, args);
        content.querySelectorAll(selector).forEach(
          elem => className.forEach(c => elem.classList.add(c)));
        return content;
      };
    }
  };
