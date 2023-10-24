import * as Express from "express";
import { Send } from "express-serve-static-core";

/**
 * @template T, V
 * @param T - (optional) structure of request route parameters
 * @param V - (optional) structure of request body
 *
 * void = optional generic parameters
 */
export type APIRequest<T = void, V = void> = Express.Request<T, any, V>;

/**
 * @template T
 * @param T - structure of response body
 */
export interface APIResponse<T = Record<string, any>> extends Express.Response {
  json: Send<
    SuccessResponseBody<T> | FailResponseBody | ErrorResponseBody,
    this
  >;
}

type SuccessResponseBody<T = Record<string, any>> = {
  status: "success";
  data: T;
};

type FailResponseBody = {
  status: "fail";
  data: Record<string, string>;
};

type ErrorResponseBody = {
  status: "error";
  message: string;
};
