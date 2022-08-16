import { useMemo, type FC } from 'react';
import dayjs from 'dayjs';

export interface Articles {
  id: number;
  title: string;
  content: string;
  description: string;
  image: {
    name: string;
    width: number;
    height: number;
    hash: string;
    url: string;
    provider: string;
  };
  locale: string;
  updatedAt: string;
  createdAt: string;
  publishedAt: string;
}

const List: FC<{ data: any[] }> = ({ data }) => {
  const list: Articles[] = useMemo(() => {
    if (data) {
      return data.map((row: any) => {
        const attributes = row.attributes.images.data.attributes;
        return {
          id: row.id,
          title: row.attributes.title,
          description: row.attributes.description,
          content: row.attributes.content,
          image: {
            name: attributes.name,
            url: attributes.url,
            width: attributes.width,
            height: attributes.height,
            provider: attributes.provider,
            hash: attributes.hash,
          },
          locale: row.attributes.locale,
          updatedAt: row.attributes.updatedAt,
          createdAt: row.attributes.createdAt,
          publishedAt: row.attributes.publishedAt,
        };
      });
    }
    return [];
  }, [data]);

  return (
    <div className="space-y-8 p-6">
      {list.map((row) => {
        return (
          <div
            className="w-full flex bg-white box-border overflow-hidden rounded-md shadow-md"
            style={{ height: 220 }}
            key={row.id}
          >
            <div
              className="h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  row.image.provider === 'local'
                    ? `url('http://localhost:1337${row.image.url}')`
                    : row.image.url,
                width: 360,
              }}
            />
            <div className="h-full flex-1 flex flex-col items-start justify-start p-6">
              <div className="h-10 text-2xl font-bold flex items-center">
                <span className="overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {row.title}
                </span>
              </div>
              <div className="w-full flex-1 mt-2 text-gray-500">{row.description}</div>
              <div className="w-full flex justify-between items-center">
                <div>{dayjs.utc(row.updatedAt).local().format('YYYY-MM-DD HH:mm:ss')}</div>
                <button className="btn btn-sm btn-outline btn-ghost rounded-none px-8 text-gray-400 border-gray-300">
                  了解更多
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default List;
