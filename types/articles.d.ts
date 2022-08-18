// 文章列表中的结构体
interface Articles {
  id: number;
  title: string;
  description: string;
  image: {
    name: string;
    width: number;
    height: number;
    hash: string;
    url: string;
    provider: string;
  };
  updatedAt: string;
  createdAt: string;
}

// 文章的排序属性
type ArticleSortType = 'title' | 'createdAt' | 'updatedAt';
