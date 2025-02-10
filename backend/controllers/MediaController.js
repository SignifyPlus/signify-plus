const ServiceFactory = require("../factories/serviceFactory.js");
class MediaController {
    
    constructor(){
    }

    //Get all Medias
    getAllMedia = async(request, response) => {
        try {
            const media = await ServiceFactory.getMediaService.getDocuments();
            response.json(media);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }

    //Get single Media
    getMediaById = async(request, response) => {
        try {
            const mediaId = request.params.id;
            const media = await ServiceFactory.getMediaService.getDocumentById(mediaId);
            response.json(media);
        }catch(exception) {
            response.status(500).json({error: exception.message})
        }
    }
}

module.exports = MediaController;