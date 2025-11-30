// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CLOUD_PROVIDERS_CONFIGURATION} from '../constants/default-settings';

import DropboxProvider from './dropbox/dropbox-provider';

const {DROPBOX_CLIENT_ID} = CLOUD_PROVIDERS_CONFIGURATION;

const DROPBOX_CLIENT_NAME = 'Kepler.gl Demo App';

export const DEFAULT_CLOUD_PROVIDER = 'dropbox';

export const CLOUD_PROVIDERS = [
  new DropboxProvider(DROPBOX_CLIENT_ID, DROPBOX_CLIENT_NAME)
];

export function getCloudProvider(providerName) {
  const cloudProvider = CLOUD_PROVIDERS.find(provider => provider.name === providerName);
  if (!cloudProvider) {
    throw new Error(`Unknown cloud provider ${providerName}`);
  }
  return cloudProvider;
}
