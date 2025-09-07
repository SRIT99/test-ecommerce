const xml2js = require('xml2js');

exports.parseXML = async (xml) => {
  return await xml2js.parseStringPromise(xml);
};
