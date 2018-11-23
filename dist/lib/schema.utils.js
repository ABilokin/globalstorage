'use strict';

var CATEGORY_TYPES = {
  Registry: 'Global',
  Dictionary: 'Global',
  System: 'Global',
  History: 'Global',
  Local: 'Local',
  Log: 'Local',
  View: 'Ignore',
  Memory: 'Ignore'
};

var extractDecorator = function extractDecorator(schema) {
  return schema.constructor.name;
};

var getCategoryType = function getCategoryType(schema) {
  return CATEGORY_TYPES[extractDecorator(schema)] || 'Local';
};

var isGlobalCategory = function isGlobalCategory(category) {
  return getCategoryType(category) === 'Global';
};

var isIgnoredCategory = function isIgnoredCategory(category) {
  return getCategoryType(category) === 'Ignore';
};

var isLocalCategory = function isLocalCategory(category) {
  return getCategoryType(category) === 'Local';
};

var decoratorToRealm = {
  Registry: 'Global',
  Dictionary: 'Global',
  System: 'System',
  Log: 'Local',
  Local: 'Local',
  Table: 'Local',
  History: 'Global',
  View: 'System',
  Object: 'Local'
};

var getCategoryRealm = function getCategoryRealm(category) {
  return decoratorToRealm[extractDecorator(category)];
};

var getCategoryFamily = function getCategoryFamily(category) {
  var decorator = extractDecorator(category);

  if (decorator === 'Object') {
    return 'Local';
  }

  return decorator;
};

var getCategoryActions = function getCategoryActions(category) {
  return Object.keys(category).filter(function (key) {
    var value = category[key];
    return value.constructor.name === 'Function' && Object.getPrototypeOf(value).name === 'Action';
  }).map(function (key) {
    return {
      Name: key,
      Execute: category[key]
    };
  });
};

module.exports = {
  getCategoryType: getCategoryType,
  isGlobalCategory: isGlobalCategory,
  isIgnoredCategory: isIgnoredCategory,
  isLocalCategory: isLocalCategory,
  extractDecorator: extractDecorator,
  getCategoryRealm: getCategoryRealm,
  getCategoryFamily: getCategoryFamily,
  getCategoryActions: getCategoryActions
};