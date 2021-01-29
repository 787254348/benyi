class Config {
  constructor() {}
}

Config.restUrl = 'https://wap.goods100.com/home/';
Config.uploadUrl = 'https://wap.goods100.com/uploads/';
Config.tokenUrl = Config.restUrl + 'vipapi/creatUserNew';
Config.messageUrl = Config.restUrl + 'vfapi/showMessageStatus';

export {
  Config
};