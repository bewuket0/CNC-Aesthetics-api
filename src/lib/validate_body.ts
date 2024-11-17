const validate_body = (_payload: any, schema: any) => {
  const { error, value } = schema.validate(_payload);

  if (error) {
    return {
      statusCode: 400,
      body: { error: error.details[0].message, data: {} },
    };
  }

  return { statusCode: 200, body: { error: null, data: value } };
};

export default validate_body;
