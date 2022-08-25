// 文章列表中的结构体
interface Articles {
  id: number;
  title: string;
  description: string;
  locale: string;
  image: {
    name: string;
    width: number;
    height: number;
    hash: string;
    url: string;
    provider: string;
  };
  categories: string[];
  tags: string[];
  updatedAt: string;
  createdAt: string;
}

// 文章其他语言的概要数据
interface OtherArticle {
  id: number;
  title: string;
  description: string;
  locale: string;
  updatedAt: string;
  createdAt: string;
}

// 文章详情
interface Article extends Articles {
  content: string;
  locales: OtherArticle[];
}

// 文章的排序属性
type ArticleSortType = 'title' | 'createdAt' | 'updatedAt';
