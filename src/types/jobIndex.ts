// src/types/jobIndex.ts

export type JobIndexItem = {
  jobId: string;
  title: string;
  isNew: boolean;
  facilityName: string;
  employmentTypeId: string;
  jobCategoryId: string;
  heroImages: string[];
  salary: {
    unitId: string;
    min: number;
    max: number;
  };

  workLocationText: string;
};

export type JobIndex = {
  facilityId?: string; // 全件indexでも使えるよう optional
  items: JobIndexItem[];
};
