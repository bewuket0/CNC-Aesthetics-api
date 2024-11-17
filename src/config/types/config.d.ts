export interface TopLevelConfig {
  MONGODB_URL: string;
  _VALS: Vals;
}

export interface Vals {
  MONGODB_URL?: string;
  BASE_URL?: string;
  PORT?: number;
  PWDSecretKey?: string;
  PWDiv?: string;
  _JWTSECRET?: string;
  _JWTEXPIREY?: number;

  _SESSIONTIMEOUT: number;
  _TEMPSESSIONTIMEOUT: number;
  PINEXPIRYDATE: number;
  docDBCONNString: string;
  docDBNAME: string;
  secret: string;
}
