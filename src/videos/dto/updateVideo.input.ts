import { Resolutions } from "../types/video"

export type UpdateVideoInputModel = {
    title: string,
    author: string,
    canBeDownloaded: boolean,

    minAgeRestriction: number | null,
    publicationDate: string,

    availableResolutions: Resolutions[]
}