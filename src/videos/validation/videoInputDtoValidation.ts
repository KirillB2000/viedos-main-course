import { FieldError } from "../../core/types/validationError";
import { CreateVideoInputModel } from "../dto/createVideo.input";
import { UpdateVideoInputModel } from "../dto/updateVideo.input";
import { Resolutions } from "../types/video";


export const createVideoInputDtoValidation = (data: CreateVideoInputModel): FieldError[] => {
    const errors: FieldError[] = [];

    if (
        !data.title ||
        typeof data.title !== 'string' ||
        data.title.trim().length > 40
    ) {
        errors.push({message: 'Invalid title', field: 'title'})
    }

    if (
        !data.author ||
        typeof data.author !== 'string' ||
        data.author.trim().length > 20
    ) {
        errors.push({message: 'Invalid author', field: 'author'})
    }

    if (!Array.isArray(data.availableResolutions)) {
        errors.push({message: 'availableResolutions must be an array', field: 'availableResolutions'})
    } else {
        const existingResolutions = Object.values(Resolutions)
        if (data.availableResolutions.length > existingResolutions.length || data.availableResolutions.length < 1) {
            errors.push({message: 'Invalid availableResolutions', field: 'availableResolutions'})
        }

        for (let resolution of data.availableResolutions) {
            if (!existingResolutions.includes(resolution)) {
                errors.push({message: 'Invalid available resolution' + resolution, field: 'availableResolutions'})
                break;
            }
        }
    }
    return errors;
}

export const updateVideoInputDtoValidation = (data: UpdateVideoInputModel): FieldError[] => {
    const errors: FieldError[] = [];
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/;

    if (
        !data.title ||
        typeof data.title !== 'string' ||
        data.title.trim().length > 40
    ) {
        errors.push({message: 'Invalid title', field: 'title'})
    }

    if (
        !data.author ||
        typeof data.author !== 'string' ||
        data.author.trim().length > 20
    ) {
        errors.push({message: 'Invalid author', field: 'author'})
    }

    if (typeof data.canBeDownloaded !== 'boolean') {
        errors.push({message: 'Invalid canBeDownloaded', field: 'canBeDownloaded'})
    }

    if (data.minAgeRestriction === undefined) {
        errors.push({message: 'minAgeRestriction required', field: 'minAgeRestriction'})
    } else if (data.minAgeRestriction !== null) {
        if (
            typeof data.minAgeRestriction !== 'number' ||
            data.minAgeRestriction < 1 || 
            data.minAgeRestriction > 18
        ) {
            errors.push({message: 'Invalid minAgeRestriction', field: 'minAgeRestriction'})
        }
    }

    // publicationDate

    if (
        !data.publicationDate ||
        typeof data.publicationDate !== 'string' ||
        !isoDateRegex.test(data.publicationDate)
    ) {
        errors.push({message: 'Invalid publicationDate', field: 'publicationDate'})
    }

    if (!Array.isArray(data.availableResolutions)) {
        errors.push({message: 'availableResolutions must be an array', field: 'availableResolutions'})
    } else {
        const existingResolutions = Object.values(Resolutions)
        if (data.availableResolutions.length > existingResolutions.length || data.availableResolutions.length < 1) {
            errors.push({message: 'Invalid availableResolutions', field: 'availableResolutions'})
        }

        for (let resolution of data.availableResolutions) {
            if (!existingResolutions.includes(resolution)) {
                errors.push({message: 'Invalid available resolution' + resolution, field: 'availableResolutions'})
                break;
            }
        }
    }
    return errors;
}