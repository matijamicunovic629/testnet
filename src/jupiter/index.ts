import {DefaultApi} from "./apis";
import {ConfigurationParameters, Configuration} from "./runtime";

/* tslint:disable */
/* eslint-disable */
export * from './runtime';
export * from './apis/index';
export * from './models/index';

export const createJupiterApiClient = (config?: ConfigurationParameters) => {
    return new DefaultApi(new Configuration(config));
};
