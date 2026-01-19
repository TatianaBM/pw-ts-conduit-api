import { faker } from '@faker-js/faker'
import { Article } from '../types/article.js'   

export function generateArticleComment(): string {
    return faker.lorem.lines(1)
}

export function generateArticle(): Article {
    return {
        article : {
            title : faker.lorem.sentence(),
            description : faker.lorem.paragraph(2),
            body : faker.lorem.paragraph(10),
            tagList : [ "AI", "Healthcare", "Technology" ]
        }
    }
}
