export const STATUS_CODE = {
  BAD_REQUEST: 400,
  UNAUTHENTICATED: 403,
  UNAUTHORISED: 401,
  SERVERERROR: 500,
  NOTFOUND: 404,
  SUCCESS: 200,
  CREATED: 201,
};

export class Base_error extends Error {
  status = STATUS_CODE.SERVERERROR;
  constructor(message, options) {
    super(message, options);
    this.status = options.status;
  }
}

export const NotFoundError = (message, options = {}) => {
  return new BaseError(message, {
    ...options,
    status: STATUS_CODE.NOTFOUND,
  });
};

export const UnauthorisedError = (message, options = {}) => {
  return new BaseError(message, {
    ...options,
    status: STATUS_CODE.UNAUTHORISED,
  });
};

export const UnauthenticatedError = (message, options = {}) => {
  return new BaseError(message, {
    ...options,
    status: STATUS_CODE.UNAUTHENTICATED,
  });
};

export const BadRequestError = (message, options = {}) => {
  return new BaseError(message, {
    ...options,
    status: STATUS_CODE.BAD_REQUEST,
  });
};
