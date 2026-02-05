import { faker } from '@faker-js/faker'
import { Article } from '../types/article.js'   
import { Tags } from '../types/article.js'
import _ from 'lodash'

export function generateArticleComment(): string {
    return faker.lorem.lines(1)
}

export function generateArticle(): Article {
    return {
        article : {
            title : faker.lorem.sentence(),
            description : faker.lorem.paragraph(2),
            body : faker.lorem.paragraph(10),
            tagList : [ "AI", "healthcare", "technology" ]
        }
    }
}

export function generateTags(): Tags {
    const randomNumberOfTags = _.random(0,10)
    let tagList = []
    for( let i = 0; i <= randomNumberOfTags; i++) {
        tagList.push(faker.word.noun())
    }
    return tagList
}
