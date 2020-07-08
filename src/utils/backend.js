import { BACKEND_URL } from '../config/constants';
import { wrapTry } from './util';

const backendFetch = (path, ...args) => wrapTry(fetch(`${BACKEND_URL}/${path}`, ...args)
  .catch((err) => console.error(err)));

export default class Backend {
  static getTipComments = async (tipId) => backendFetch(`comment/api/tip/${encodeURIComponent(tipId)}`);

  static async sendTipComment(tipId, text, author, signCb, parentId) {
    const sendComment = async (postParam) => backendFetch('comment/api/', {
      method: 'post',
      body: JSON.stringify(postParam),
      headers: { 'Content-Type': 'application/json' },
    });

    const responseChallenge = await sendComment({ tipId, text, author });
    const signedChallenge = await signCb(responseChallenge.challenge);
    const respondChallenge = {
      challenge: responseChallenge.challenge,
      signature: signedChallenge,
      parentId,
    };

    return sendComment(respondChallenge);
  }

  static getAllComments = async () => backendFetch('comment/api/');

  static async pinOrUnPinItem(entryId, type, address, signCb, pinItem = true) {
    const sendData = async (postParam) => backendFetch(`pin/${address}`, {
      method: pinItem ? 'post' : 'delete',
      body: JSON.stringify(postParam),
      headers: { 'Content-Type': 'application/json' },
    });

    const responseChallenge = await sendData({ entryId, type });
    const signedChallenge = await signCb(responseChallenge.challenge);
    const respondChallenge = {
      challenge: responseChallenge.challenge,
      signature: signedChallenge,
    };
    return sendData(respondChallenge);
  }

  static getPinnedItems = async (address) => backendFetch(`pin/${address}`);

  static getProfile = async (address) => backendFetch(`profile/${address}`);

  static sendProfileData = async (address, postParam) => backendFetch(`profile/${address}`, {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  });

  static setImage = async (address, data) => {
    const request = {
      method: 'post',
      body: data,
    };
    return backendFetch(`profile/${address}`, request);
  };

  static claimFromUrl = async (postParam) => backendFetch('claim/submit', {
    method: 'post',
    body: JSON.stringify(postParam),
    headers: { 'Content-Type': 'application/json' },
  });

  static async sendPostReport(tipId, author, signCb) {
    const sendReport = async (postParam) => backendFetch('blacklist/api/wallet', {
      method: 'post',
      body: JSON.stringify(postParam),
      headers: { 'Content-Type': 'application/json' },
    });

    const responseChallenge = await sendReport({ tipId, author });
    const signedChallenge = await signCb(responseChallenge.challenge);
    const respondChallenge = {
      challenge: responseChallenge.challenge,
      signature: signedChallenge,
    };
    return sendReport(respondChallenge);
  }

  static getProfileImageUrl = (address) => `${BACKEND_URL}/profile/image/${address}`;

  static getStats = async () => backendFetch('static/stats/');

  static getCacheTipById = async (id) => backendFetch(`cache/tip?id=${id}`);

  static getCacheUserStats = async (address) => backendFetch(`cache/userStats?address=${address}`);

  static getCacheTips = async (ordering, page, address = null, search = null, blacklist = true) => {
    let query = `?ordering=${ordering}&page=${page}`;
    if (address) query += `&address=${address}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    query += `&blacklist=${blacklist}`;

    return backendFetch(`cache/tips${query}`);
  };

  static getCacheStats = async () => backendFetch('cache/stats');

  static getCacheChainNames = async () => backendFetch('cache/chainnames');

  static getPrice = async () => backendFetch('cache/price');

  static getOracleCache = async () => backendFetch('cache/oracle');

  static getTopicsCache = async () => backendFetch('cache/topics');

  static getTokenInfo = async () => backendFetch('tokenCache/tokenInfo');

  static cacheInvalidateTips = async () => backendFetch('cache/invalidate/tips');

  static getCommentCountForAddress = async (address) => backendFetch(`comment/count/author/${address}`);

  static getTipPreviewUrl = (previewLink) => `${BACKEND_URL}${previewLink}`;

  static getCommentById = async (id) => backendFetch(`comment/api/${id}`);

  static getVerifiedUrls = async () => backendFetch('verified');

  static getGrayListedUrls = async () => backendFetch('static/wallet/graylist');

  static getTipTraceBackend = (id) => backendFetch(`tracing/backend?id=${id}`)

  static getTipTraceBlockchain = (id) => backendFetch(`tracing/blockchain?id=${id}`)
}
