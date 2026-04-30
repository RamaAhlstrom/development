import ComLib from '../../Common/Library/CommonLibrary';
import { PackagesListFilterAndSearchQuery } from './PackagesOnLoadQuery';

export default function PackagesListCaption(clientAPI) {
    const totalCountQueryOptionsPromise = PackagesListFilterAndSearchQuery(clientAPI);
    const countQueryOptionsPromise = PackagesListFilterAndSearchQuery(clientAPI, true, true);

    return Promise.all([totalCountQueryOptionsPromise, countQueryOptionsPromise])
        .then(([totalCountQueryOptions, countQueryOptions]) => {
            const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsPackages', totalCountQueryOptions);
            const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsPackages', countQueryOptions);

            return Promise.all([countPromise, totalCountPromise]);
        })
        .then(([count, totalCount]) => {
            if (count === totalCount) {
                return clientAPI.localizeText('all_caption', [totalCount]);
            }
            return clientAPI.localizeText('all_caption_double', [count, totalCount]);
        })
        .catch(error => {
            throw error;
        });
}
