class BaseResponse {
  success(errorCode = 0, result = null) {
    return {
      errorCode: "S200",
      message: "The api access successful",
      result: {
        errorCode,
        result,
      },
    };
  }

  fail(errorCode = "S500", message = "") {
    return {
      errorCode,
      message,
    };
  }
}

module.exports = new BaseResponse();
