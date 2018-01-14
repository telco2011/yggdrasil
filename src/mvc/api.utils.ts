export enum PARAMETER {
  ID = ':id'
}

export class API {
  // API V1 DEFAULT
  static DEFAULT = '/api';

  // API PARAMETERS
  static PARAMETERS = PARAMETER;

  // SESSION API
  static SESSION = {
    LOGIN: '/login'
  };

  static testApi(route) {
    return API.DEFAULT + route;
  }

  static testApiWithParameters(route: string, parameters: string[]) {
    if (API.hasURIParameters(route)) {
      if (route.match(new RegExp(':', 'g')).length > 1) {
        // TODO: Review when there are more than 1 parameter
        return route;
      } else {
        const result = route.replace(API.getURIParameter(route), parameters[0]);
        return API.testApi(result);
      }
    }
    // TODO: Review this return
    return route;
  }

  static getURIParameter(uri: string) {
    const splitedUri = uri.split(':');
    for (const item of splitedUri) {
      for (const key in PARAMETER) {
        if (PARAMETER.hasOwnProperty(key) && ':'.concat(item) === PARAMETER[key]) {
          return PARAMETER[key];
        }
      }
    }
    // TODO: Review this return
    // throw Error('Error');
  }

  static hasURIParameters(uri: string) {
    let parametersCount = 0;
    let result = false;
    for (const key in PARAMETER) {
      if (PARAMETER.hasOwnProperty(key) && uri.includes(PARAMETER[key])) {
        parametersCount++;
      }
    }
    if (uri.match(new RegExp(':', 'g')).length === parametersCount) { result = true; }
    return result;
  }
}
