const Media = require("../models/Media")
const MediaService = require("../services/MediaService")
class MediaController {
    
    //Get all Medias
    static async getAllMedia(request, response) {
        try {
            const media = await MediaService.getDocument();
            response.json(media);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Media
    static async getMediaById(request, response) {
        try {
            const mediaId = request.params.id;
            const media = await MediaService.getDocument(mediaId);
            response.json(media);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }


}

modeule.exports = MediaController;