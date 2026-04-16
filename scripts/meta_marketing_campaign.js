/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * All rights reserved.
 * @flow
 */

'use strict';
const bizSdk = require('facebook-nodejs-business-sdk');
const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;

let access_token = 'EAARLwIJnO30BREkyWb8kskqnhZAkkZCrD11Rp28ZAjOqSKZBL6YFu0ynij4dwcYgDqxSv5XAEFPkXBC1ZApvgFTZCPPv0syoXNguZB8IqZAelKOqnacADPNGykO3l4P3h0wYZBzHmT8RTCBxUGSxqkXB20tfoD9X8triw62SrbtVtBxDS2zykcmEsoOXc4kRYoJ3qDHu97ZB0w';
let app_id = '1209190100450173';
let ad_account_id = 'act_823774960184177';
let campaign_name = 'Campaña Tráfico Arecofix';

const api = bizSdk.FacebookAdsApi.init(access_token);
const showDebugingInfo = true; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

const logApiCallResult = (apiCallName, data) => {
  console.log(apiCallName);
  if (showDebugingInfo) {
    console.log('Data:' + JSON.stringify(data, null, 2));
  }
};

let fields, params;

void async function() {
  try {
    // Create an ad campaign with objective OUTCOME_TRAFFIC
    fields = [];
    params = {
      'name': campaign_name,
      'objective': 'OUTCOME_TRAFFIC',
      'status': 'PAUSED',
      'special_ad_categories': [],
      'is_adset_budget_sharing_enabled': false,
    };
    
    console.log('Creando campaña...');
    let campaign = await (new AdAccount(ad_account_id)).createCampaign(
      fields,
      params
    );
    let campaign_id = campaign.id;

    console.log('============================================');
    console.log('¡Campaña creada exitosamente! ID: ' + campaign_id);
    console.log('============================================');

  } catch(error) {
    console.error('Error al crear campaña:', error.response?.error || error);
    process.exit(1);
  }
}();
