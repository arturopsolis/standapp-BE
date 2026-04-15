'use strict';

/**
 * user-video-progress controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-video-progress.user-video-progress', ({ strapi }) => ({

  async create(ctx) {
    const { data } = ctx.request.body;
    const userId = ctx.state.user.id;

    const entry = await strapi.documents('api::user-video-progress.user-video-progress').create({
      data: {
        videoId: data.videoId,
        progressSeconds: data.progressSeconds,
        completed: data.completed ?? false,
        user: userId,
      },
    });

    return { data: entry };
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    const entry = await strapi.documents('api::user-video-progress.user-video-progress').update({
      documentId: id,
      data: {
        progressSeconds: data.progressSeconds,
        completed: data.completed ?? false,
      },
    });

    return { data: entry };
  },

  async find(ctx) {
    const userId = ctx.state.user.id;

    const entries = await strapi.documents('api::user-video-progress.user-video-progress').findMany({
      filters: { user: { id: userId } },
      pagination: { pageSize: 500 },
    });

    return { data: entries };
  },

}));
