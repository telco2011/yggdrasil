import {
	FileLogger
} from '../core';

export enum REQUEST_PARAMS {
	USER_INFO = 'USER-INFO'
}

export class RequestUtils {

	private logger = new FileLogger('RequestUtils');

	public getRequestHeader(req: any, paramName: string, options?: IOptions): any {
		if (this.hasParamInHeader(paramName)) {
			if (options) {
				if (options.asJSONObject) {
					try {
						return JSON.parse(req.get(paramName));
					} catch (error) {
						this.logger.error(`Error getting request param ${paramName} as JSONObject. Getting default.`);
					}
				} else if (options.asString) {
					this.logger.debug('Option asString selected. Getting default.');
				}
			} else {
				this.logger.debug('Not options added. Getting default.');
			}
		}
		return req.get(paramName);
	}

	// TODO: Review this tslint
	// tslint:disable-next-line
	private hasParamInHeader(param: string): Boolean {
		if (param in REQUEST_PARAMS) {
			this.logger.debug(`Param ${param} is a controlled param.`);
			return true;
		}
		this.logger.warn(`Param ${param} is not a controlled param. Getting default.`);
		return false;
	}

}

export interface IOptions {
	// TODO: Review this tslint
	// tslint:disable-next-line
	asString ? : Boolean;
	// tslint:disable-next-line
	asJSONObject ? : Boolean;
}
