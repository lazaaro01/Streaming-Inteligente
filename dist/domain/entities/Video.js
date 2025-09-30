"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
class Video {
    constructor(id, title, description, url, views = 0) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.url = url;
        this.views = views;
    }
}
exports.Video = Video;
