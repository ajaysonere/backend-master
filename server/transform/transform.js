import { imageUrlTransformer } from "../utils/helper.js"

export const transformer = (news) =>{
    return {
      id: news.id,
      news: news.title,
      content: news.content,
      image: imageUrlTransformer(news.image),
      created_at: news.created_at,
      reporter: {
        id: news?.user.id,
        name: news?.user.name,
        profile:
          news?.user?.profile === null
            ? null
            : imageUrlTransformer(news?.user?.profile),
      },
    };
}