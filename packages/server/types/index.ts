import { Send, Request, Response } from "express-serve-static-core";

/**
 * @template T, V
 * @param T - (optional) structure of request route parameters
 * @param V - (optional) structure of request body
 *
 * void = optional generic parameters
 */
export type APIRequest<T = Record<string, never>, V = void> = Request<
  T,
  any,
  V
>;

/**
 * @template T
 * @param T - structure of response body
 */
export interface APIResponse<T = null> extends Response {
  json: Send<
    SuccessResponseBody<T> | FailResponseBody | ErrorResponseBody,
    this
  >;
}

type SuccessResponseBody<T = null> = {
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
