const axios = require('axios');
const { parseXML } = require('../utils/xmlParser');
const { esewa } = require('../config/env');

const base = () => (esewa.env === 'RC' ? 'https://rc.esewa.com.np' : 'https://uat.esewa.com.np');

exports.gatewayBase = base;

exports.verify = async ({ amt, pid, rid }) => {
  const params = new URLSearchParams({ amt, scd: esewa.merchant, pid, rid });
  const resp = await axios.post(`${base()}/epay/transrec`, params.toString());
  const parsed = await parseXML(resp.data);
  return parsed?.response?.response_code?.[0] === 'Success';
};
