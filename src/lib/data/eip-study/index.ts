export * from '../types/StudyBoardItem';

import { StudyBoardItem } from '../types/StudyBoardItem';

import { softwareDesignData } from './softwareDesign';
import { softwareDevelopmentData } from './softwareDevelopment';
import { databaseData } from './database';
import { programmingLanguageData } from './programmingLanguage';
import { informationSystemData } from './informationSystem';

type StudyBoardWithoutId =
    Omit<StudyBoardItem, 'id'>;

const rawStudyBoardData: StudyBoardWithoutId[] = [
    ...softwareDesignData,
    ...softwareDevelopmentData,
    ...databaseData,
    ...programmingLanguageData,
    ...informationSystemData,
];

export const studyBoardData: StudyBoardItem[] =
    rawStudyBoardData.map((item, index) => ({
        id: index + 1,
        ...item,
    }));