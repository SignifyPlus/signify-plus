const Media = require("../models/Media")
const MediaService = require("../services/MediaService")
class MediaController {
    
    constructor(){
        this.mediaService = new MediaService(Media);
        this.getAllMedia = this.getAllMedia.bind(this);
        this.getMediaById = this.getMediaById.bind(this);
    }
    //Get all Medias
    async getAllMedia(request, response) {
        try {
            const media = await this.mediaService.getDocument();
            response.json(media);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Media
    async getMediaById(request, response) {
        try {
            const mediaId = request.params.id;
            const media = await this.mediaService.getDocument(mediaId);
            response.json(media);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = MediaController;