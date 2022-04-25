'use strict';

const axios = require(`axios`);
const TIMEOUT = 1000;
const {API_PREFIX, HttpMethod} = require(`../constants`);

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

  async getArticles({limit, offset, userId, categoryId, withComments, onlyHot}) {
    return await this._load(`/articles`, {params: {limit, offset, userId, categoryId, withComments, onlyHot}});
  }

  async getArticle(id, {needComments}) {
    return await this._load(`/articles/${id}`, {params: {needComments}});
  }

  async search(query) {
    return await this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return await this._load(`/categories`, {params: {count}});
  }

  async getCategory(id) {
    return await this._load(`/categories/${id}`);
  }

  async createCategory(data) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data
    });
  }
  async editCategory(id, data) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }
  async deleteCategory(id) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  async createArticle(data) {
    return await this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  async deleteComment(id) {
    return this._load(`/comments/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  async getComments({onlyLast, limit, userId} = {}) {
    return this._load(`/comments`, {params: {onlyLast, limit, userId}});
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
