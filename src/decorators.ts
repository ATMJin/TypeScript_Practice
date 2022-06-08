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