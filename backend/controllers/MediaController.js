const Media = require("../models/Media")
const MediaService = require("../services/MediaService")
class MediaController {
    
    constructor(){
        this.mediaService = new MediaService(Media);
    }
    //Get all Medias
    getAllMedia = async(request, response) => {
        try {
            const media = await this.mediaService.getDocuments();
            response.json(media);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Media
    getMediaById = async(request, response) => {
        try {
            const mediaId = request.params.id;
            const media = await this.mediaService.getDocumentById(mediaId);
            response.json(media);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

module.exports = MediaController;