import axios from 'axios'
import { v4 } from 'uuid'

import handleError from '../helpers/errorHandler.js'

export const getTranslation = async (translationQuery) => {
    const endpoint = 'https://api.cognitive.microsofttranslator.com'
    const location = 'westeurope'
    const subscriptionKey = '212bef63f5ed46d6bfd6cd0d2b41fc33'

    return axios({
        baseURL: endpoint,
        url: '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': v4().toString(),
        },
        params: {
            'api-version': '3.0',
            from: 'en',
            to: 'ru',
        },
        data: [
            {
                text: translationQuery,
            },
        ],
        responseType: 'json',
    })
        .then(function (response) {
            const translatedString = response.data[0].translations[0].text

            return translatedString
        })
        .catch((error) => {
            handleError(error, 'Error while getting translation')
        })
}
