import { Resolutions, Video } from "../videos/types/video";

export const getDateISOByDays = (days: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const db = {
  videos: <Video[]>[
    {
      id: 1,
      title: "Learn TypeScript from Scratch",
      author: "Dimych",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: getDateISOByDays(),
      publicationDate: getDateISOByDays(1),
      availableResolutions: [Resolutions.P720, Resolutions.P1080],
    },
    {
      id: 2,
      title: "Express.js Deep Dive",
      author: "IT-Incubator",
      canBeDownloaded: false,
      minAgeRestriction: 12,
      createdAt: getDateISOByDays(),
      publicationDate: getDateISOByDays(2),
      availableResolutions: [
        Resolutions.P144,
        Resolutions.P360,
        Resolutions.P480,
      ],
    },
    {
      id: 3,
      title: "Node.js Advanced Patterns",
      author: "Alex",
      canBeDownloaded: true,
      minAgeRestriction: 18,
      createdAt: getDateISOByDays(),
      publicationDate: getDateISOByDays(2),
      availableResolutions: [Resolutions.P1440, Resolutions.P2160],
    },
  ],
};
