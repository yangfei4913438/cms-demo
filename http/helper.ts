import qs from 'qs';
import conf from 'conf/index';

interface IOptions {
  fields: string[];
  populate: object;
  options: { [key: string]: any };
}

export const createOptions = ({ fields, populate, options }: IOptions) => {
  return qs.stringify(
    {
      populate,
      fields,
      ...options,
      filters: {
        ...(options?.filters ?? {}),
        systems: {
          id: {
            $in: conf.system, // 限定数据来源。这里的两个ID对应不同的语言
          },
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
};
