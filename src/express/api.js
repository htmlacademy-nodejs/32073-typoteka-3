'use strict';

const axios = require(`axios`);
const TIMEOUT = 1000;
const {API_PREFIX} = require(`../constants`);

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}${API_PREFIX}/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async getArticles({comments}) {
    return await this._load(`/articles`, {params: {comments}});
  }

  async getArticle(id) {
    return await this._load(`/articles/${id}`);
  }

  async search(query) {
    return await this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return await this._load(`/categories`, {params: {count}});
  }

  async createArticle(data) {
    return await this._load(`/articles`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
