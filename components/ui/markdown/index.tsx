import ReactMarkdown from 'react-markdown';
import MDPre from 'components/ui/markdown/pre';
import MDVideo from 'components/ui/markdown/video';
import MDImage from 'components/ui/markdown/image';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import React, { FC } from 'react';
import cx from 'classnames';

interface MarkdownProps {
  className?: string;
  content: string;
}

const Markdown: FC<MarkdownProps> = ({ content, className }) => {
  return (
    <div className={cx('prose prose-lg max-w-lg lg:col-span-10 lg:max-w-none ', className)}>
      <article className="markdown-area">
        <ReactMarkdown
          components={{
            pre: ({ node, ...props }: any) => {
              return (
                <MDPre className={props.className} iconCLassName="text-white">
                  {props.children}
                </MDPre>
              );
            },
            video: ({ node, ...props }: any) => {
              return <MDVideo {...props} />;
            },
            img: ({ node, ...props }: any) => {
              return <MDImage {...props} />;
            },
          }}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default Markdown;
