export function isPlainObject(obj) {
  return (
    typeof obj === 'object' && // separate from primitives
    obj !== null && // is obvious
    obj.constructor === Object && // separate instances (Array, DOM, ...)
    Object.prototype.toString.call(obj) === '[object Object]'
  ); // separate build-in like Math
}

export function capitalize(str: string) {
  return [str.charAt(0).toUpperCase(), ...str.split('').slice(1)].join('');
}
